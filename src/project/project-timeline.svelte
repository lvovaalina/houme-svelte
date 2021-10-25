<script>
    import { SvelteGantt, SvelteGanttDependencies, SvelteGanttExternal, SvelteGanttTable } from 'svelte-gantt';
    import { onMount } from 'svelte';
    import { time } from '../utils';

    export let stages;
    let rows = [];
    let tasks = [];

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

        stages.forEach(element => {
            let parentRow = rows.find(row => row.label == element.name);
            if (element.tasks && element.tasks.length !== 0) {
                element.tasks.forEach(task => {
                    let childRow = parentRow.children.find(child => child.label == task.name);
                    addTask(task, childRow.id, element.color);
                });
            } else {
                addTask(element, parentRow.id, element.color);
            }
        });
    }

    function translateStagesToRows() {
        let index = 0;
        stages.forEach(element => {
            let children = [];
            index++;

            let newRow = {
                id: index,
                label: element.name,
            }
            
            if (element.tasks && element.tasks.length !== 0) {
                element.tasks.forEach((task) => {
                    index++;
                    children.push({
                        id: index,
                        label: task.name
                    });
                });
            }

            if (children && children.length !== 0) {
                newRow.class = 'row-group';
                newRow.children =  children;
            }

            rows.push(newRow);
        });
    }

    let gantt;
    const currentStart = time('01-01');
    const currentEnd = time('12-31');

    const options = {
        rows: [],
        tasks: [],
        headers: [{ unit: 'year', format: 'YYYY', sticky: true }, { unit: 'month', format: 'MMMM YYYY', sticky: true }],
        fitWidth: true,
        from: currentStart.clone().startOf('year'),
        to: currentStart.clone().endOf('year'),
        to: currentEnd,
        tableHeaders: [{ title: 'Label', property: 'label', width: 140, type: 'tree' }],
        tableWidth: 240,
        minWidth: 5000,
        columnUnit: 'day',
        ganttTableModules: [SvelteGanttTable],
        ganttBodyModules: [SvelteGanttDependencies],
        //taskContent: (task) => `${task.label} ${task.from.format('MMMM Do')} - ${task.to.format('MMMM Do')}`
    }

    onMount(() => {
        gantt = new SvelteGantt({ 
            // target a DOM element
            target: document.getElementById('example-gantt'), 
            // svelte-gantt options
            props: options
        });
        translateStagesToRows();
        translateStagesToTasks();

        let data = {rows: rows, tasks: tasks};

        // not sure why, will be fixed by fetching data from backend
        setTimeout(() => gantt.$set({...data}), 1000);
    });

</script>

<div class="container">
    <div id="example-gantt"></div>
</div>

<style>
    #example-gantt {
        flex-grow: 1;
        overflow: auto;
    }
    
    :global(.sg-task-reflected .sg-task-content) {
        visibility: hidden;
    }
</style>