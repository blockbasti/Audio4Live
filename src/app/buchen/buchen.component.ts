import { Component, OnInit, ViewChild, AfterContentInit, AfterViewInit } from '@angular/core';

import {
  ChangeDetectionStrategy,
  TemplateRef
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarMonthViewDay,
  CalendarDateFormatter,
  CalendarView,
  DAYS_OF_WEEK
} from 'angular-calendar';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Buchung } from '../buchung';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-buchen',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './buchen.component.html',
  styleUrls: ['./buchen.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter
    }
  ]
})
export class BuchenComponent implements OnInit, AfterViewInit {

  locale: string = 'de';
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  minDate: Date = new Date();

  activeDayIsOpen: boolean = false;
  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
  weekendDays: number[] = [DAYS_OF_WEEK.SATURDAY, DAYS_OF_WEEK.SUNDAY];

  events: CalendarEvent[] = [

  ];

  dateIsValid(date: Date): boolean {
    return date > this.minDate;
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach(day => {
      if (!this.dateIsValid(day.date)) {
        day.cssClass = 'cal-disabled';
      }
    });
  }

  constructor() { }

  ngOnInit() {
    
  }

  ngAfterViewInit(): void {

  }

  model = new Buchung('', '');

  submitted = false;
  onSubmit(): void {
    this.submitted = true;
  }

}
