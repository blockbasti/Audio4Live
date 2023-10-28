import { ChangeDetectionStrategy, Component, ElementRef, Injectable, ViewChild } from '@angular/core';
import { Firestore, Timestamp, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Functions, httpsCallableData } from '@angular/fire/functions';
import { Title } from '@angular/platform-browser';
import { CalendarEvent, CalendarMonthViewDay, CalendarUtils, CalendarView, DAYS_OF_WEEK } from 'angular-calendar';
import { GetMonthViewArgs, MonthView } from 'calendar-utils';
import {
  Interval,
  addMonths,
  addWeeks,
  areIntervalsOverlapping,
  closestIndexTo,
  endOfMonth,
  format,
  getWeeksInMonth,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isThisMonth,
  isWithinInterval,
  startOfMonth,
  toDate
} from 'date-fns';
import { de } from 'date-fns/locale';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import { Subject } from 'rxjs';
import { AGBComponent } from '../shared/agb/agb.component';
import { DatenschutzComponent } from '../shared/datenschutz/datenschutz.component';
import { Blocker } from './blocker';
import { Buchung } from './buchung';

@Injectable()
export class MyCalendarUtils extends CalendarUtils {
  getMonthView(args: GetMonthViewArgs): MonthView {
    args.viewStart = startOfMonth(args.viewDate);
    // always display 5 weeks in calendar
    const weeksInMonth = getWeeksInMonth(args.viewDate, { weekStartsOn: DAYS_OF_WEEK.MONDAY });
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
  providers: [
    {
      provide: CalendarUtils,
      useClass: MyCalendarUtils
    }
  ]
})
export class BuchenComponent {
  submit: any;
  verify: any;
  constructor(
    readonly afs: Firestore,
    readonly fns: Functions,
    readonly titleService: Title,
    private readonly modalService: MdbModalService
  ) {
    titleService.setTitle('Buchungsanfrage - Audio4Live');

    // get all blocker
    const blockerCollection = collection(afs, 'blocker').withConverter<Blocker>({
      fromFirestore: (snapshot) => {
        return new Blocker(
          {
            start: (snapshot.data().start as Timestamp).toDate(),
            end: (snapshot.data().end as Timestamp).toDate()
          },
          snapshot.data().isSingleDay,
          snapshot.id
        );
      },
      toFirestore: (it: any) => it
    });

    const blockerquery = query(blockerCollection, where('end', '>=', new Date()));

    collectionData(blockerquery).subscribe((blocker) => {
      this.blocker = blocker;
      this.refresh.next(null);
    });

    this.submit = httpsCallableData(fns, 'submit');
    this.verify = httpsCallableData(fns, 'verify');
  }

  datenschutzModalRef: MdbModalRef<DatenschutzComponent> | null = null;
  AGBModalRef: MdbModalRef<AGBComponent> | null = null;

  config = {
    animation: true,
    backdrop: true,
    containerClass: 'right',
    ignoreBackdropClick: false,
    keyboard: true,
    modalClass: 'modal-top-right modal-dialog-scrollable'
  };

  refresh: Subject<any> = new Subject();

  locale = 'de';
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  minDate: Date = new Date();

  activeDayIsOpen = false;
  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
  weekendDays: number[] = [DAYS_OF_WEEK.SATURDAY, DAYS_OF_WEEK.SUNDAY];

  blocker: Blocker[];

  events: CalendarEvent[] = [];

  darkTheme: NgxMaterialTimepickerTheme = {
    container: {
      bodyBackgroundColor: '#424242',
      buttonColor: '#fff'
    },
    dial: {
      dialBackgroundColor: '#555'
    },
    clockFace: {
      clockFaceBackgroundColor: '#555',
      clockHandColor: '#78909c',
      clockFaceTimeInactiveColor: '#fff'
    }
  };

  selectedMonthViewDay: CalendarMonthViewDay;
  selectedInterval: Interval = undefined;

  model = new Buchung();

  @ViewChild('alert', { static: true }) alert: ElementRef;

  captchaResponse = '';

  dateIsValid(date: Date): boolean {
    return date > this.minDate && date < addMonths(Date.now(), 3);
  }

  dateIsSingleDate(date: Date): boolean {
    if (!this.blocker) {
      return false;
    }
    return this.blocker.some((blocker) => {
      return blocker.isSingleDay && isWithinInterval(date, blocker.interval);
    });
  }

  dateIsBlocked(date: Date): boolean {
    if (!this.blocker) {
      return false;
    }
    return this.blocker.some((blocker) => {
      return !blocker.isSingleDay && isWithinInterval(date, blocker.interval);
    });
  }

  containsBlockedDate(interval: Interval): boolean {
    return this.blocker.some((blocker) => {
      return !blocker.isSingleDay && areIntervalsOverlapping(blocker.interval, interval, { inclusive: true });
    });
  }

  containsSingleDate(interval: Interval): boolean {
    return this.blocker.some((blocker) => {
      return blocker.isSingleDay && areIntervalsOverlapping(blocker.interval, interval, { inclusive: true });
    });
  }

  dayClicked(day: CalendarMonthViewDay): void {
    if (!this.dateIsValid(day.date) || this.dateIsBlocked(day.date)) {
      return;
    }
    this.selectedMonthViewDay = day;

    const oldInterval: Interval = Object.assign({}, this.selectedInterval);

    if (
      this.selectedInterval === undefined ||
      this.dateIsSingleDate(day.date) ||
      this.dateIsSingleDate(toDate(oldInterval.start)) ||
      this.dateIsSingleDate(toDate(oldInterval.end))
    ) {
      this.selectedInterval = {
        start: day.date,
        end: day.date
      };
      this.refresh.next(null);
      this.model.date = this.selectedInterval;
      return;
    }

    if (isBefore(day.date, this.selectedInterval.start)) {
      this.selectedInterval.start = day.date;
      if (this.containsBlockedDate(this.selectedInterval) || this.containsSingleDate(this.selectedInterval)) {
        this.selectedInterval = oldInterval;
        return;
      }
      this.refresh.next(null);
      this.model.date = this.selectedInterval;
      return;
    }

    if (isAfter(day.date, this.selectedInterval.end)) {
      this.selectedInterval.end = day.date;
      if (this.containsBlockedDate(this.selectedInterval) || this.containsSingleDate(this.selectedInterval)) {
        this.selectedInterval = oldInterval;
        return;
      }
      this.refresh.next(null);
      this.model.date = this.selectedInterval;
      return;
    }

    if (isWithinInterval(day.date, this.selectedInterval)) {
      if (isSameDay(this.selectedInterval.start, this.selectedInterval.end) && isSameDay(day.date, this.selectedInterval.end)) {
        this.selectedInterval = undefined;
        this.refresh.next(null);
        this.model.date = this.selectedInterval;
        return;
      }
      if (isSameDay(day.date, this.selectedInterval.end) || isSameDay(day.date, this.selectedInterval.start)) {
        this.selectedInterval.start = day.date;
        this.selectedInterval.end = day.date;
        if (this.containsBlockedDate(this.selectedInterval) || this.containsSingleDate(this.selectedInterval)) {
          this.selectedInterval = oldInterval;
          return;
        }
        this.refresh.next(null);
        this.model.date = this.selectedInterval;
        return;
      }

      if (closestIndexTo(day.date, [this.selectedInterval.start, this.selectedInterval.end]) === 0) {
        this.selectedInterval.start = day.date;
        if (this.containsBlockedDate(this.selectedInterval) || this.containsSingleDate(this.selectedInterval)) {
          this.selectedInterval = oldInterval;
          return;
        }
        this.refresh.next(null);
        this.model.date = this.selectedInterval;
        return;
      } else {
        this.selectedInterval.end = day.date;
        if (this.containsBlockedDate(this.selectedInterval) || this.containsSingleDate(this.selectedInterval)) {
          this.selectedInterval = oldInterval;
          return;
        }
        this.refresh.next(null);
        this.model.date = this.selectedInterval;
        return;
      }
    }
  }

  isThisMonth(date: Date) {
    return isThisMonth(date);
  }

  isRangeMonth(date: Date) {
    return isSameMonth(date, addMonths(Date.now(), 3));
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach((day) => {
      if (!this.dateIsValid(day.date)) {
        day.cssClass = 'cal-disabled';
      } else if (this.dateIsBlocked(day.date)) {
        day.cssClass = 'cal-blocked';
      } else if (this.selectedInterval !== undefined && isWithinInterval(day.date, this.selectedInterval)) {
        if (this.dateIsSingleDate(day.date)) {
          day.cssClass = 'cal-single cal-day-selected';
        } else {
          day.cssClass = 'cal-day-selected';
        }
      } else if (this.dateIsSingleDate(day.date)) {
        day.cssClass = 'cal-single';
      }
    });
  }

  displaySelectedDate(): string {
    if (this.selectedInterval === undefined) {
      return 'kein Datum gewählt';
    }

    if (isSameDay(this.selectedInterval.start, this.selectedInterval.end)) {
      return format(this.selectedInterval.start, 'dd. LLL yyy', { locale: de });
    }

    return (
      format(this.selectedInterval.start, 'dd. LLL yyy', { locale: de }) +
      ' - ' +
      format(this.selectedInterval.end, 'dd. LLL yyy', { locale: de })
    );
  }

  async resolved(captchaResponse: string) {
    if (captchaResponse === null) {
      return;
    }

    this.verify(captchaResponse).subscribe((resp: { status: 'ok' | 'error' }) => {
      if (resp.status == 'ok') {
        this.captchaResponse = captchaResponse;
      } else {
        this.captchaResponse = '';
      }
    });
  }

  openDatenschutzModal() {
    this.datenschutzModalRef = this.modalService.open(DatenschutzComponent, this.config);
  }

  openAGBModal() {
    this.AGBModalRef = this.modalService.open(AGBComponent, this.config);
  }

  onSubmit(): void {
    this.submit(this.model).subscribe((_: any) => {
      this.alert.nativeElement.classList.remove('d-none');
      setTimeout(() => {
        this.alert.nativeElement.classList.add('d-none');
      }, 10000);

      this.model = new Buchung();
      this.selectedInterval = undefined;
      this.captchaResponse = '';
      this.refresh.next(null);
    });
  }
}
