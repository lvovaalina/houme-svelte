import moment from 'moment';

export function time(input) {
    return moment('2021-' + input, 'YYYY-MM-DD');
}
