import moment from 'moment';
import 'moment/locale/pl';

export function setTimeLocale(lang) {
    if (lang == '') {
        moment.locale('pl');
    } else {
        moment.locale('en')
    }
}

export function time(input) {
    return moment('2021-' + input, 'YYYY-MM-DD');
}

export let stageColorMap = new Map([
    [
        'Excavation',
        {color: 'teal'/*'red'*/, code: 'exv'}
    ],
    [
        'Wykop',
        {color: 'teal'/*'red'*/, code: 'exv'}
    ],
    [
        'Foundation',
        {color: 'green'/*'pink'*/, code: 'fnd'}
    ],
    [
        'Fundamenta',
        {color: 'green'/*'pink'*/, code: 'fnd'}
    ],
    [
        'Walls',
        {color: 'light-green'/*'purple'*/, code: 'wll'}
    ],
    [
        'Ściany',
        {color: 'light-green'/*'purple'*/, code: 'wll'}
    ],
    [
        'Roof',
        {color: 'light-green'/*'deep-purple'*/, code: 'rff'}
    ],
    [
        'Dach',
        {color: 'light-green'/*'deep-purple'*/, code: 'rff'}
    ],
    [
        'Windows and windowsills',
        {color: 'light-green'/*'indigo'*/, code: 'wnw'}
    ],
    [
        'Okna i parapety',
        {color: 'light-green'/*'indigo'*/, code: 'wnw'}
    ],
    [
        'Insulation',
        {color: 'light-green' /*'blue'*/, code: 'hi'}
    ],
    [
        'Izolacja',
        {color: 'light-green' /*'blue'*/, code: 'hi'}
    ],
    [
        'Subfloor/Floor System',
        {color: 'light-green' /*'light-blue'*/, code: 'fs'}
    ],
    [
        'Podkład podłogowy',
        {color: 'light-green' /*'light-blue'*/, code: 'fs'}
    ],
    
    // [
    //     'Stairs',
    //     {color: 'yellow' /*'cyan'*/, code: 'st'}
    // ],
    // [
    //     'Exterior decoration of the house',
    //     {color: 'yellow' /*'teal'*/, code: 'exdec'}
    // ],
    // [
    //     'Floor',
    //     {color:  'yellow' /*'green'*/, code: 'flr'}
    // ],
    // [
    //     'Electrical wiring',
    //     {color:  'yellow' /*'light-green'*/, code: 'ewr'}
    // ],
    // [
    //     'Plumbing',
    //     {color: 'yellow' /*'brown'*/, code: 'pm'}
    // ],
    // [
    //     'Interior decoration of the house',
    //     {color:  'yellow' /*'lime'*/, code: 'intdec'}
    // ],
    // [
    //     'Doors',
    //     {color:  'yellow' /*'yellow'*/, code: 'drs'}
    // ],
    // [
    //     'Kitchen assembly, equipment installation',
    //     {color: 'amber' /*'amber'*/, code: 'ka'}
    // ],
    // [
    //     'Lighting, switches',
    //     {color: 'amber' /*'orange'*/, code: 'ls'}
    // ],
    // [
    //     'Furnishing',
    //     {color: 'amber' /*'deep-orange'*/, code: 'fr'}
    // ],
    [
        'Commissioning works',
        {color: 'light-orange'/*'brown'*/, code: 'cwr'}
    ],
    [
        'Prace uruchomieniowe',
        {color: 'light-orange'/*'brown'*/, code: 'cwr'}
    ],
]);

export let stageMap = new Map([
    [
        'Excavation',
        {color: 'teal', code: 'exv'}
    ],
    [
        'Wykop',
        {color: 'teal', code: 'exv'}
    ],
    [
        'Foundation',
        {color: 'green', code: 'fnd'}
    ],
    [
        'Fundamenta',
        {color: 'green', code: 'fnd'}
    ],
    [
        'Box',
        {color: 'light-green', code: 'box'}
    ],
    [
        'Pudełko',
        {color: 'light-green', code: 'box'}
    ],
    // [
    //     'Interior',
    //     {color: 'yellow', code: 'int'}
    // ],
    // [
    //     'Furnishing',
    //     {color: 'amber', code: 'frn'}
    // ],
    [
        'Commissioning works',
        {color: 'light-orange', code: 'cw'}
    ],
    [
        'Prace uruchomieniowe',
        {color: 'light-orange', code: 'cw'}
    ],
]);

export function numberWithCommas(x) {
    if (!!x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return x;
}