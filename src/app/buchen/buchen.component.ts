import { Component, OnInit, ViewChild, AfterContentInit, AfterViewInit, Injectable } from '@angular/core';

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
  addHours,
  subWeeks,
  format,
  startOfMonth,
  getWeeksInMonth,
  addWeeks,
  Interval,
  eachDayOfInterval,
  isWithinInterval,
  closestIndexTo,
  isBefore,
  isAfter,
  isThisSecond
} from 'date-fns';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarMonthViewDay,
  CalendarDateFormatter,
  CalendarView,
  DAYS_OF_WEEK,
  CalendarUtils
} from 'angular-calendar';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GetMonthViewArgs, MonthView } from 'calendar-utils';

import { Buchung } from '../buchung';
import { de } from 'date-fns/locale';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';

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

@Injectable()
export class MyCalendarUtils extends CalendarUtils {
  getMonthView(args: GetMonthViewArgs): MonthView {
    args.viewStart = startOfMonth(args.viewDate);
    // always display 5 weeks in calendar
    let weeksInMonth = getWeeksInMonth(args.viewDate, { weekStartsOn: DAYS_OF_WEEK.MONDAY });
    if (weeksInMonth <= 5) {
      args.viewEnd = addWeeks(endOfMonth(args.viewDate), 1);
    } else {
      args.viewEnd = endOfMonth(args.viewDate);
    }

    return super.getMonthView(args);
  }
}

@Component({
  selector: 'app-buchen',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './buchen.component.html',
  styleUrls: ['./buchen.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter
    },
    {
      provide: CalendarUtils,
      useClass: MyCalendarUtils
    }
  ]
})
export class BuchenComponent implements OnInit, AfterViewInit {

  refresh: Subject<any> = new Subject();

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

  darkTheme: NgxMaterialTimepickerTheme = {
    container: {
        bodyBackgroundColor: '#424242',
        buttonColor: '#fff'
    },
    dial: {
        dialBackgroundColor: '#555',
    },
    clockFace: {
        clockFaceBackgroundColor: '#555',
        clockHandColor: '#9fbd90',
        clockFaceTimeInactiveColor: '#fff'
    }
};

  selectedMonthViewDay: CalendarMonthViewDay;
  selectedInterval: Interval = undefined;

  dateIsValid(date: Date): boolean {
    return date > this.minDate;
  }

  dayClicked(day: CalendarMonthViewDay): void {
    if (!this.dateIsValid(day.date)) return;
    this.selectedMonthViewDay = day;

    if (this.selectedInterval === undefined) {
      this.selectedInterval = {
        start: day.date,
        end: day.date
      }
      this.refresh.next();
      return;
    }

    if (isBefore(day.date, this.selectedInterval.start)) {
      this.selectedInterval.start = day.date;
      this.refresh.next();
      return;
    }

    if (isAfter(day.date, this.selectedInterval.end)) {
      this.selectedInterval.end = day.date;
      this.refresh.next();
      return;
    }

    if (isWithinInterval(day.date, this.selectedInterval)) {
      if(isSameDay(this.selectedInterval.start,this.selectedInterval.end) && isSameDay(day.date, this.selectedInterval.end)){
        this.selectedInterval = undefined;
        this.refresh.next();
        return;
      }
      if (isSameDay(day.date, this.selectedInterval.end) || isSameDay(day.date, this.selectedInterval.start)) {
        this.selectedInterval.start = day.date;
        this.selectedInterval.end = day.date;
        this.refresh.next();
        return;
      }

      if (closestIndexTo(day.date, [this.selectedInterval.start, this.selectedInterval.end]) === 0) {
        this.selectedInterval.start = day.date;
        this.refresh.next();
        return;
      } else {
        this.selectedInterval.end = day.date;
        this.refresh.next();
        return;
      }
    }
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach(day => {
      if (!this.dateIsValid(day.date)) {
        day.cssClass = 'cal-disabled';
      } else if (
        isWithinInterval(day.date, this.selectedInterval)
      ) {
        day.cssClass = 'cal-day-selected';
      }
    });
  }

  constructor() { }

  ngOnInit() {

  }

  ngAfterViewInit(): void {

  }

  displaySelectedDate(): string{
    
    if(this.selectedInterval === undefined){
      return 'kein Datum gewählt'
    }

    if (isSameDay(this.selectedInterval.start, this.selectedInterval.end)) {
      return format(this.selectedInterval.start, 'dd. LLL yyy', {locale: de});
    }

    return format(this.selectedInterval.start, 'dd. LLL yyy', {locale: de}) + ' - ' + format(this.selectedInterval.end, 'dd. LLL yyy', {locale: de});

  }

  model = new Buchung();

  submitted = false;
  onSubmit(): void {
    this.submitted = true;
  }

}
