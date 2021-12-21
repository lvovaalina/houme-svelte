import moment from 'moment';

export function time(input) {
    return moment('2021-' + input, 'YYYY-MM-DD');
}

export let stageColorMap = new Map([
    [
        'Excavation',
        {color: 'teal'/*'red'*/, code: 'exv'}
    ],
    [
        'Foundation',
        {color: 'green'/*'pink'*/, code: 'fnd'}
    ],
    [
        'Walls',
        {color: 'light-green'/*'purple'*/, code: 'wll'}
    ],
    [
        'Roof',
        {color: 'light-green'/*'deep-purple'*/, code: 'rff'}
    ],
    [
        'Windows and windowsills',
        {color: 'light-green'/*'indigo'*/, code: 'wnw'}
    ],
    [
        'Insulation',
        {color: 'light-green' /*'blue'*/, code: 'hi'}
    ],
    [
        'Subfloor/Floor System',
        {color: 'light-green' /*'light-blue'*/, code: 'fs'}
    ],
    [
        'Stairs',
        {color: 'yellow' /*'cyan'*/, code: 'st'}
    ],
    [
        'Exterior decoration of the house',
        {color: 'yellow' /*'teal'*/, code: 'exdec'}
    ],
    [
        'Floor',
        {color:  'yellow' /*'green'*/, code: 'flr'}
    ],
    [
        'Electrical wiring',
        {color:  'yellow' /*'light-green'*/, code: 'ewr'}
    ],
    [
        'Plumbing',
        {color: 'yellow' /*'brown'*/, code: 'pm'}
    ],
    [
        'Interior decoration of the house',
        {color:  'yellow' /*'lime'*/, code: 'intdec'}
    ],
    [
        'Doors',
        {color:  'yellow' /*'yellow'*/, code: 'drs'}
    ],
    [
        'Kitchen assembly, equipment installation',
        {color: 'amber' /*'amber'*/, code: 'ka'}
    ],
    [
        'Lighting, switches',
        {color: 'amber' /*'orange'*/, code: 'ls'}
    ],
    [
        'Furnishing',
        {color: 'amber' /*'deep-orange'*/, code: 'fr'}
    ],
    [
        'Commissioning works',
        {color: 'light-orange'/*'brown'*/, code: 'cwr'}
    ],
]);

export let stageMap = new Map([
    [
        'Excavation',
        {color: 'teal', code: 'exv'}
    ],
    [
        'Foundation',
        {color: 'green', code: 'fnd'}
    ],
    [
        'Box',
        {color: 'light-green', code: 'box'}
    ],
    [
        'Interior',
        {color: 'yellow', code: 'int'}
    ],
    [
        'Furnishing',
        {color: 'amber', code: 'frn'}
    ],
    [
        'Commissioning works',
        {color: 'light-orange', code: 'cw'}
    ],
]);
