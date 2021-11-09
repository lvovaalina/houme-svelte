<script>
    import { SvelteGantt, SvelteGanttDependencies,  SvelteGanttTable } from 'svelte-gantt';
    import { onMount } from 'svelte';
    import { time } from '../utils';

    let gantt;
    let currentStart = time('01-01');
    let currentEnd = time('12-31');

    export let jobs = [];
    let rows = [];
    let tasks = [];

    //let selectedTask = {};

    let taskColors = ['orange', 'green', 'blue'];

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
                resourceId: resourceId
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
            console.log('TASKS', tasks);

            let to = tasks[tasks.length - 1].to;
            data = {rows: rows, tasks: tasks, to: to};

            gantt.$set({...data});
        }
    }

    function onTaskClick(task) {
        console.log(task);
    }

    const options = {
        rows: [],
        tasks: [],
        headers: [{ sticky: true, unit: 'year', format: 'YYYY' }, { sticky: true, unit: 'month', format: 'MMMM' }],
        fitWidth: false,
        from: currentStart.clone().startOf('year'),
        to: currentEnd,
        tableHeaders: [{ title: 'Stages', property: 'label', width: 140, type: 'tree' }],
        tableWidth: 240,
        minWidth: 1000,
        columnUnit: 'day',
        ganttTableModules: [SvelteGanttTable],
        ganttBodyModules: [SvelteGanttDependencies],
        zoomLevel: [],
    }

    onMount(() => {
        gantt = new SvelteGantt({ 
            // target a DOM element
            target: document.getElementById('example-gantt'), 
            // svelte-gantt options
            props: options
        });
        //gantt.api.tasks.on.select(onTaskSelect);
    });

    //let container;

    // function onTaskSelect(task) {
    //     selectedTask = task[0];
    //     console.log(selectedTask.label);
    //     container.style.top = selectedTask.top + 'px';
    //     container.style.letf = selectedTask.left + 'px';
    // }

</script>

<div class="container">
    <!-- {#if !!selectedTask && !!selectedTask.model}
    <div bind:this={container} class="task-prop" style="position:absolute;top:{selectedTask.model.top};left:{selectedTask.model.left};">
        {selectedTask.top}
        {selectedTask.left}
        {selectedTask.model.label}
    </div>
    {/if} -->
   
    <div id="example-gantt"></div>
</div>

<style>
    .container {
        /* -header height -tab header height */
        height: calc(100vh - 64px - 56px);
    }
    #example-gantt {
        flex-grow: 1;
        overflow: auto;
	    border: #efefef 1px solid;
        margin-top: 10px;
    }
    
    :global(.sg-task-reflected .sg-task-content) {
        visibility: hidden;
    }
</style>