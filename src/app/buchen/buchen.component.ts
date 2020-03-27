import { Component, OnInit, AfterViewInit, Injectable, ViewChild, ElementRef } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';

import {SubmitService} from './submit.service';

import { ChangeDetectionStrategy } from '@angular/core';
import {
  endOfMonth,
  isSameDay,
  format,
  startOfMonth,
  getWeeksInMonth,
  addWeeks,
  Interval,
  isWithinInterval,
  closestIndexTo,
  isBefore,
  isAfter,
  areIntervalsOverlapping,
  addHours,
  addMinutes
} from 'date-fns';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarMonthViewDay,
  CalendarDateFormatter,
  CalendarView,
  DAYS_OF_WEEK,
  CalendarUtils
} from 'angular-calendar';
import { GetMonthViewArgs, MonthView } from 'calendar-utils';

import { Buchung } from './buchung';
import { de } from 'date-fns/locale';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';

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
export class BuchenComponent {

  refresh: Subject<any> = new Subject();

  locale: string = 'de';
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  minDate: Date = new Date();

  activeDayIsOpen: boolean = false;
  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
  weekendDays: number[] = [DAYS_OF_WEEK.SATURDAY, DAYS_OF_WEEK.SUNDAY];

  blocker: Interval[];

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

  dateIsBlocked(date: Date): boolean {
    if (!this.blocker) return false;
    return this.blocker.some(intv => {
      return isWithinInterval(date, intv);
    });
  }

  containsBlockedDate(interval: Interval): boolean {
    return this.blocker.some(blocker => {
      return areIntervalsOverlapping(blocker, interval, { inclusive: true });
    })
  }

  dayClicked(day: CalendarMonthViewDay): void {
    if (!this.dateIsValid(day.date) || this.dateIsBlocked(day.date)) return;
    this.selectedMonthViewDay = day;

    const oldInterval = Object.assign({}, this.selectedInterval);

    if (this.selectedInterval === undefined) {
      this.selectedInterval = {
        start: day.date,
        end: day.date
      }
      this.refresh.next();
      this.model.date = this.selectedInterval;
      return;
    }

    if (isBefore(day.date, this.selectedInterval.start)) {
      this.selectedInterval.start = day.date;
      if (this.containsBlockedDate(this.selectedInterval)) {
        this.selectedInterval = oldInterval;
        return;
      }
      this.refresh.next();
      this.model.date = this.selectedInterval;
      return;
    }

    if (isAfter(day.date, this.selectedInterval.end)) {
      this.selectedInterval.end = day.date;
      if (this.containsBlockedDate(this.selectedInterval)) {
        this.selectedInterval = oldInterval;
        return;
      }
      this.refresh.next();
      this.model.date = this.selectedInterval;
      return;
    }

    if (isWithinInterval(day.date, this.selectedInterval)) {
      if (isSameDay(this.selectedInterval.start, this.selectedInterval.end) && isSameDay(day.date, this.selectedInterval.end)) {
        this.selectedInterval = undefined;
        this.refresh.next();
        this.model.date = this.selectedInterval;
        return;
      }
      if (isSameDay(day.date, this.selectedInterval.end) || isSameDay(day.date, this.selectedInterval.start)) {
        this.selectedInterval.start = day.date;
        this.selectedInterval.end = day.date;
        if (this.containsBlockedDate(this.selectedInterval)) {
          this.selectedInterval = oldInterval;
          return;
        }
        this.refresh.next();
        this.model.date = this.selectedInterval;
        return;
      }

      if (closestIndexTo(day.date, [this.selectedInterval.start, this.selectedInterval.end]) === 0) {
        this.selectedInterval.start = day.date;
        if (this.containsBlockedDate(this.selectedInterval)) {
          this.selectedInterval = oldInterval;
          return;
        }
        this.refresh.next();
        this.model.date = this.selectedInterval;
        return;
      } else {
        this.selectedInterval.end = day.date;
        if (this.containsBlockedDate(this.selectedInterval)) {
          this.selectedInterval = oldInterval;
          return;
        }
        this.refresh.next();
        this.model.date = this.selectedInterval;
        return;
      }
    }
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach(day => {
      if (!this.dateIsValid(day.date)) {
        day.cssClass = 'cal-disabled';
      } else if (this.dateIsBlocked(day.date)) {
        day.cssClass = 'cal-blocked';
      } else if (this.selectedInterval !== undefined &&
        isWithinInterval(day.date, this.selectedInterval)
      ) {
        day.cssClass = 'cal-day-selected';
      }
    });
  }

  constructor(private afs: AngularFirestore, private submitService: SubmitService) {
    afs.collection<any>('blocker', ref => ref.where('start', '>=', new Date())).valueChanges().subscribe(blocker => { this.blocker = blocker.map(b => { return { start: (b.start as firebase.firestore.Timestamp).toDate(), end: (b.end as firebase.firestore.Timestamp).toDate() } }); this.refresh.next() });
  }

  displaySelectedDate(): string {

    if (this.selectedInterval === undefined) {
      return 'kein Datum gewählt'
    }

    if (isSameDay(this.selectedInterval.start, this.selectedInterval.end)) {
      return format(this.selectedInterval.start, 'dd. LLL yyy', { locale: de });
    }

    return format(this.selectedInterval.start, 'dd. LLL yyy', { locale: de }) + ' - ' + format(this.selectedInterval.end, 'dd. LLL yyy', { locale: de });

  }

  model = new Buchung();

  times = {start: '', end: ''};

  @ViewChild('alert', { static: true }) alert: ElementRef;

  onSubmit(): void {
    if(this.times.start !== ''){
      this.model.date.start = addHours(this.model.date.start, Number.parseInt(this.times.start.split(':')[0]));
      this.model.date.start = addMinutes(this.model.date.start, Number.parseInt(this.times.start.split(':')[1]));
    }

    if(this.times.end !== ''){
      this.model.date.end = addHours(this.model.date.end, Number.parseInt(this.times.end.split(':')[0]));
      this.model.date.end = addMinutes(this.model.date.end, Number.parseInt(this.times.end.split(':')[1]));
    }
    
    this.submitService.submitForm(this.model).subscribe((_v) => {
      this.alert.nativeElement.classList.add('show');
      this.alert.nativeElement.classList.remove('d-none');
      setTimeout(() => {
        this.alert.nativeElement.classList.remove('show');
        this.alert.nativeElement.classList.add('d-none');
      },10000);

      this.model = new Buchung();
      this.selectedInterval = undefined;
      this.times = {start: '', end: ''};
      this.refresh.next();
    });
  }

}
