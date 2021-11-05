import moment from 'moment';

export function time(input) {
    return moment('2021-' + input, 'YYYY-MM-DD');
}

export let stageColorMap = new Map([
    [
        'Excavation',
        {color: 'bg-teal-100'/*'bg-red-100'*/, code: 'exv'}
    ],
    [
        'Foundation',
        {color: 'bg-green-100'/*'bg-pink-100'*/, code: 'fnd'}
    ],
    [
        'Walls',
        {color: 'bg-light-green-100'/*'bg-purple-100'*/, code: 'wll'}
    ],
    [
        'Roof',
        {color: 'bg-light-green-100'/*'bg-deep-purple-100'*/, code: 'rff'}
    ],
    [
        'Windows and windowsills',
        {color: 'bg-light-green-100'/*'bg-indigo-100'*/, code: 'wnw'}
    ],
    [
        'Warming',
        {color: 'bg-light-green-100' /*'bg-blue-100'*/, code: 'hi'}
    ],
    [
        'Subfloor/Floor System',
        {color: 'bg-light-green-100' /*'bg-light-blue-100'*/, code: 'fs'}
    ],
    [
        'Stairs',
        {color: 'bg-light-green-100' /*'bg-cyan-100'*/, code: 'st'}
    ],
    [
        'Exterior decoration of the house',
        {color: 'bg-light-green-100' /*'bg-teal-100'*/, code: 'exdec'}
    ],
    [
        'Floor',
        {color:  'bg-yellow-100' /*'bg-green-100'*/, code: 'flr'}
    ],
    [
        'Electrical wiring',
        {color:  'bg-yellow-100' /*'bg-light-green-100'*/, code: 'ewr'}
    ],
    [
        'Plumbing',
        {color: 'bg-yellow-100' /*'bg-brown-100'*/, code: 'pm'}
    ],
    [
        'Interior decoration of the house',
        {color:  'bg-yellow-100' /*'bg-lime-100'*/, code: 'intdec'}
    ],
    [
        'Doors',
        {color:  'bg-yellow-100' /*'bg-yellow-100'*/, code: 'drs'}
    ],
    [
        'Kitchen assembly, equipment installation',
        {color: 'bg-amber-100' /*'bg-amber-100'*/, code: 'ka'}
    ],
    [
        'Lighting, switches',
        {color: 'bg-amber-100' /*'bg-orange-100'*/, code: 'ls'}
    ],
    [
        'Furnishing',
        {color: 'bg-amber-100' /*'bg-deep-orange-100'*/, code: 'fr'}
    ],
    [
        'Commissioning works',
        {color: 'bg-orange-100'/*'bg-brown-100'*/, code: 'cwr'}
    ],
]);

export let stageMap = new Map([
    [
        'Excavation',
        {color: 'bg-teal-100', code: 'exv'}
    ],
    [
        'Foundation',
        {color: 'bg-green-100', code: 'fnd'}
    ],
    [
        'Box',
        {color: 'bg-light-green-100', code: 'box'}
    ],
    [
        'Interior',
        {color: 'bg-yellow-100', code: 'int'}
    ],
    [
        'Furnishing',
        {color: 'bg-amber-100', code: 'frn'}
    ],
    [
        'Commissioning works',
        {color: 'bg-orange-100', code: 'cw'}
    ],
]);
