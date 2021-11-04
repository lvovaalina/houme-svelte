import moment from 'moment';

export function time(input) {
    return moment('2021-' + input, 'YYYY-MM-DD');
}

export let stageColorMap = new Map([
    [
        'Excavation',
        {color: 'bg-red-100', code: 'exv'}
    ],
    [
        'Foundation',
        {color: 'bg-pink-100', code: 'fnd'}
    ],
    [
        'Walls',
        {color: 'bg-purple-100', code: 'wll'}
    ],
    [
        'Roof',
        {color: 'bg-deep-purple-100', code: 'rff'}
    ],
    [
        'Windows and windowsills',
        {color: 'bg-indigo-100', code: 'wnw'}
    ],
    [
        'Warming',
        {color: 'bg-blue-100', code: 'hi'}
    ],
    [
        'Subfloor/Floor System',
        {color: 'bg-light-blue-100', code: 'fs'}
    ],
    [
        'Stairs',
        {color: 'bg-cyan-100', code: 'st'}
    ],
    [
        'Exterior decoration of the house',
        {color: 'bg-teal-100', code: 'exdec'}
    ],
    [
        'Floor',
        {color: 'bg-green-100', code: 'flr'}
    ],
    [
        'Electrical wiring',
        {color: 'bg-light-green-100', code: 'ewr'}
    ],
    [
        'Interior decoration of the house',
        {color: 'bg-lime-100', code: 'intdec'}
    ],
    [
        'Doors',
        {color: 'bg-yellow-100', code: 'drs'}
    ],
    [
        'Kitchen assembly, equipment installation',
        {color: 'bg-amber-100', code: 'ka'}
    ],
    [
        'Plumbing',
        {color: 'bg-brown-100', code: 'pm'}
    ],
    [
        'Lighting, switches',
        {color: 'bg-orange-100', code: 'ls'}
    ],
    [
        'Furnishing',
        {color: 'bg-deep-orange-100', code: 'fr'}
    ],
    [
        'Commissioning works',
        {color: 'bg-brown-100', code: 'cwr'}
    ],
]);
