import { Interval } from 'date-fns';

export class Buchung {

    constructor(
        public email: string = '',
        public phone: string = '',
        public call: boolean = false,
        public message: string = '',
        public date?: Interval,
        public location: string = '',
        public times = {start: '', end: ''}
    ){
    }
}
