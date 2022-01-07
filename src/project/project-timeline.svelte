<script>
    import { SvelteGantt, SvelteGanttDependencies,  SvelteGanttTable, MomentSvelteGanttDateAdapter } from 'svelte-gantt';
    import { onMount } from 'svelte';
    import { time } from '../utils';
    import moment from 'moment';

    import { responsive } from '../store';
    import { numberWithCommas } from '../utils';

    export let currency;
    export let projectDuration;

    let gantt;
    let currentStart = time('01-01');
    let currentEnd = time('12-31');
    let responsiveHeight = '';

    export let jobs = [];
    let rows = [];
    let tasks = [];

    let taskColors = ['orange', 'green', 'blue'];
    let monthNames = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct",
        "Nov", "Dec"];

    function translateStagesToTasks() {
        function addTask(task, resourceId, color) {
            let id = rows.length + 1 + tasks.length;
            let colorClass = !!color ? color : taskColors[id % 3];

            let newTask = {
                id: id,
                label: task.name,
                enableDragging: false,
                classes: colorClass,
                from: task.from,
                to: task.to,
                resourceId: resourceId,
                workers: task.workersCount,
                cost: task.cost,
                materials: task.materials,
                materialsCost: task.materialsCost,
            }

            // to do: figure out how to recalculate position based on timeline width
            if (task.name == 'Kitchen assembly, equipment installation'
                || task.name == 'Commissioning works') {
                    newTask.classes += ' position-hack';
                }

            tasks.push(newTask);
            return newTask;
        }

        jobs.forEach(element => {
            let parentRow = rows.find(row => row.label == element.name);
            if (element.tasks && element.tasks.length !== 0) {
                element.tasks.forEach(task => {
                    let childRow = parentRow.children.find(child => child.label == task.name);
                    if (task.children && task.children.length !== 0) {
                        task.children.forEach(ch => {
                            let chRow = childRow.children.find(child => child.label == ch.name);
                            addTask(ch, chRow.id, element.color);
                        });
                    } else {
                        addTask(task, childRow.id, element.color);
                    }
                });
            } else {
                addTask(element, parentRow.id, element.color);
            }
        });
    }

    function translateStagesToRows() {
        let index = 0;
        jobs.forEach(element => {
            let children = [];
            index++;

            let newRow = {
                id: index,
                label: element.name,
            }
            
            if (element.tasks && element.tasks.length !== 0) {
                element.tasks.forEach((task) => {
                    index++;

                    let newTask = {
                        id: index,
                        label: task.name,
                    }

                    if (task.children && task.children.length !== 0) {
                        let ch = [];
                        task.children.forEach((chl) => {
                            index++;
                            ch.push({id: index, label: chl.name});
                        });
                        newTask.children = ch;
                    }

                    children.push(newTask);
                });
            }

            if (children && children.length !== 0) {
                newRow.class = 'row-group';
                newRow.children =  children;
            }

            rows.push(newRow);
        });
    }

    $: {
        dataChanged(jobs);
    }

    function dataChanged(jobs) {
        if (jobs.length && jobs.length !== 0) {
            rows = [], tasks = [];
            let data = {rows:[], tasks:[]}
            gantt.$set({...data});

            translateStagesToRows();
            translateStagesToTasks();

            let to = tasks[tasks.length - 1].to;
            data = {rows: rows, tasks: tasks, to: to};

            if (projectDuration > 365) {
                data.minWidth = 2000;
            }

            gantt.$set({...data});

            // wait for gantt element to render before removing clickable headers
            setTimeout(() => {
                let headerCells = document.getElementsByClassName('column-header-cell');

                let startIndex = 0;
                headerCells.forEach((el, index) => {
                    let elClone = el.cloneNode(true);
                    
                    // hack to fix HM-238 without forking repository
                    let headerText = elClone.children[0].innerHTML;
                    if (monthNames.findIndex(x => headerText.startsWith(x)) >= 0) {
                        let monthNumber = (index)%12;
                        elClone.children[0].innerHTML = monthNames[monthNumber] + headerText.substring(3);
                    }

                    el.parentNode.replaceChild(elClone, el);
                });
            });
        }
    }

    const options = {
        dateAdapter: new MomentSvelteGanttDateAdapter(moment),
        rows: [],
        tasks: [],
        headers: [{ sticky: true, unit: 'month', format: 'MMM YYYY' }],
        fitWidth: true,
        from: currentStart.clone().startOf('year'),
        to: currentEnd,
        tableHeaders: [{ title: 'Stages', property: 'label', width: 140, type: 'tree' }],
        tableWidth: 240,
        minWidth: 1000,
        columnUnit: 'day',
        zoomLevels: [{headers: [{ sticky: true, unit: 'month', format: 'MMMM' }]}],
        ganttTableModules: [SvelteGanttTable],
        ganttBodyModules: [SvelteGanttDependencies],
        taskElementHook: (node, task) => {
            let popup;
            function onHover() {
                popup = createPopup(task, node);
            }

            function onLeave() {
                if (popup) {
                    popup.remove();
                }
            }

            let scrollContainer = document.getElementsByClassName("sg-timeline-body")[0];

            node.addEventListener('mouseenter', onHover);
            node.addEventListener('mouseleave', onLeave);
            scrollContainer.addEventListener('scroll', onLeave);

            return {
                destroy() {
                    node.removeEventListener('mouseenter', onHover);
                    node.removeEventListener('mouseleave scroll', onLeave);
                    scrollContainer.removeEventListener('scroll', onLeave);
                }
            }
        },
    }

    function createPopup(task, node) {
        if (!!task.materials && task.materials.length > 0) {
            let materialsList = '';
            task.materials.forEach((x, index) => {
                if (index == task.materials.length - 1) {
                    materialsList += x.name;
                } else {
                    materialsList += x.name + ', ';
                }
            });

            task.materialsList = materialsList;
        }

        const rect = node.getBoundingClientRect();
        const div = document.createElement('div');

        div.innerHTML = `
            <div class="sg-popup-title">${task.label}</div>
            <div class="sg-popup-item">
                <div class="sg-popup-item-label">Start Date:</div>
                <div class="sg-popup-item-value">${task.from.format('D MMM YYYY')}</div>
            </div>
            <div class="sg-popup-item">
                <div class="sg-popup-item-label">End Date:</div>
                <div class="sg-popup-item-value">${task.to.format('D MMM YYYY')}</div>
            </div>
            <div class="sg-popup-item">
                <div class="sg-popup-item-label">Workers:</div>
                <div class="sg-popup-item-value">${task.workers}</div>
            </div>
            <div class="sg-popup-item">
                <div class="sg-popup-item-label">Job Cost:</div>
                <div class="sg-popup-item-value">${currency + numberWithCommas(task.cost)}</div>
            </div>
        `

        if (!!task.materialsList) {
            div.innerHTML += `
            <div class="sg-popup-item">
                    <div class="sg-popup-item-label">Material Cost:</div>
                    <div class="sg-popup-item-value">${currency + numberWithCommas(task.materialsCost)}</div>
                </div>
                <div class="sg-popup-item">
                    <div class="sg-popup-item-label">Materials:</div>
                    <div class="sg-popup-item-value" style="text-align: right;">${task.materialsList}</div>
                </div>
            `
        }

        var body = document.body,
            html = document.documentElement;

        var height = Math.max( body.scrollHeight, body.offsetHeight, 
            html.clientHeight, html.scrollHeight, html.offsetHeight);
        
        div.style.left = `${rect.left + rect.width / 2}px`;
        div.style.top = `${rect.bottom}px`;
        div.style.position = 'absolute';
        div.classList = 'sg-popup invisible';
        document.body.appendChild(div);
        if (rect.bottom + div.offsetHeight > height) {
            // 40 - task height
            let top = rect.bottom - div.offsetHeight - 40;
            div.style.top = `${top}px`
        }

        div.classList = 'sg-popup';

        return div;
    }

    onMount(() => {
        if ($responsive) {
            responsiveHeight = document.documentElement.clientHeight - 38 - 39 - 12 - 46;
        }

        gantt = new SvelteGantt({ 
            // target a DOM element
            target: document.getElementById('example-gantt'), 
            // svelte-gantt options
            props: options
        });
    });
</script>

<div class="gantt-container" style={!!responsiveHeight ? "height:" + responsiveHeight + "px" : ""}>
    <div id="example-gantt" style={!!responsiveHeight ? "height:" + responsiveHeight + "px" : ""}></div>
</div>

<style>
    .gantt-container {
        /* -header height -tab header height container bottom padding */
        height: calc(100vh - 64px - 76px - 20px);
    }

    #example-gantt {
        flex-grow: 1;
        overflow: auto;
	    border: #efefef 1px solid;
        height: calc(100vh - 64px - 76px - 20px);
    }

    :global(#example-gantt .column-header-cell) {
        cursor: auto;
    }
    
    :global(.sg-task-reflected .sg-task-content) {
        visibility: hidden;
    }

    :global(.column-header-cell:hover) {
        background: none !important;
    }

    @media only screen and (max-width:839px)
    {
        #example-gantt, .gantt-container {
            height: calc(100vh - 38px - 39px - 12px - 46px);
        }

        :global(.sg-table, .sg-resize) {
            display: none !important;
        }

        :global(.sg-task-content) {
            font-size: 13px !important;
        }
    }
</style>