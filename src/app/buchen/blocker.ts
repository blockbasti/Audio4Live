import { Interval } from 'date-fns';

export class Blocker {
  constructor(
    public interval: Interval,
    public isSingleDay: boolean,
    public id?: string
  ) {}
}
