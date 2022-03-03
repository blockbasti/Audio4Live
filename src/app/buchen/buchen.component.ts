import { ChangeDetectionStrategy, Component, ElementRef, Injectable, ViewChild, ViewEncapsulation } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Title } from '@angular/platform-browser';
import { CalendarEvent, CalendarMonthViewDay, CalendarUtils, CalendarView, DAYS_OF_WEEK } from 'angular-calendar';
import { GetMonthViewArgs, MonthView } from 'calendar-utils';
import {
  addMonths,
  addWeeks,
  areIntervalsOverlapping,
  closestIndexTo,
  endOfMonth,
  format,
  getWeeksInMonth,
  Interval,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isThisMonth,
  isWithinInterval,
  startOfMonth,
} from 'date-fns';
import { de } from 'date-fns/locale';
import firebase from 'firebase/compat/app';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import { Subject } from 'rxjs';
import { PreloadImgService } from '../preload-img.service';
import { DatenschutzModalService } from '../shared/datenschutz-modal.service';
import { Buchung } from './buchung';
import { SubmitService } from './submit.service';

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
  encapsulation: ViewEncapsulation.None,
  templateUrl: './buchen.component.html',
  styleUrls: ['./buchen.component.scss'],
  providers: [
    {
      provide: CalendarUtils,
      useClass: MyCalendarUtils,
    },
  ],
})
export class BuchenComponent {
  constructor(afs: AngularFirestore, private submitService: SubmitService, private preloadService: PreloadImgService, titleService: Title, public datenschutzModalService: DatenschutzModalService) {
    titleService.setTitle('Buchungsanfrage - Audio4Live');
    afs
      .collection<any>('blocker', (ref) => ref.where('end', '>=', new Date()))
      .valueChanges()
      .subscribe((blocker) => {
        this.blocker = blocker.map((b) => {
          return {
            start: (b.start as firebase.firestore.Timestamp).toDate(),
            end: (b.end as firebase.firestore.Timestamp).toDate(),
          };
        });
        this.refresh.next(null);
      });
  }

  refresh: Subject<any> = new Subject();

  locale = 'de';
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  minDate: Date = new Date();

  activeDayIsOpen = false;
  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
  weekendDays: number[] = [DAYS_OF_WEEK.SATURDAY, DAYS_OF_WEEK.SUNDAY];

  blocker: Interval[];

  events: CalendarEvent[] = [];

  darkTheme: NgxMaterialTimepickerTheme = {
    container: {
      bodyBackgroundColor: '#424242',
      buttonColor: '#fff',
    },
    dial: {
      dialBackgroundColor: '#555',
    },
    clockFace: {
      clockFaceBackgroundColor: '#555',
      clockHandColor: '#78909c',
      clockFaceTimeInactiveColor: '#fff',
    },
  };

  selectedMonthViewDay: CalendarMonthViewDay;
  selectedInterval: Interval = undefined;

  model = new Buchung();

  @ViewChild('alert', { static: true }) alert: ElementRef;

  captchaResponse = '';

  loaded() {
    this.preloadService.preloadImages();
    document.getElementById('loader')?.classList.add('hidden');
    setTimeout(() => {
      document.getElementById('loader')?.remove();
    }, 2000);
  }

  dateIsValid(date: Date): boolean {
    return date > this.minDate && date < addMonths(Date.now(), 3);
  }

  dateIsBlocked(date: Date): boolean {
    if (!this.blocker) {
      return false;
    }
    return this.blocker.some((intv) => {
      return isWithinInterval(date, intv);
    });
  }

  containsBlockedDate(interval: Interval): boolean {
    return this.blocker.some((blocker) => {
      return areIntervalsOverlapping(blocker, interval, { inclusive: true });
    });
  }

  dayClicked(day: CalendarMonthViewDay): void {
    if (!this.dateIsValid(day.date) || this.dateIsBlocked(day.date)) {
      return;
    }
    this.selectedMonthViewDay = day;

    const oldInterval = Object.assign({}, this.selectedInterval);

    if (this.selectedInterval === undefined) {
      this.selectedInterval = {
        start: day.date,
        end: day.date,
      };
      this.refresh.next(null);
      this.model.date = this.selectedInterval;
      return;
    }

    if (isBefore(day.date, this.selectedInterval.start)) {
      this.selectedInterval.start = day.date;
      if (this.containsBlockedDate(this.selectedInterval)) {
        this.selectedInterval = oldInterval;
        return;
      }
      this.refresh.next(null);
      this.model.date = this.selectedInterval;
      return;
    }

    if (isAfter(day.date, this.selectedInterval.end)) {
      this.selectedInterval.end = day.date;
      if (this.containsBlockedDate(this.selectedInterval)) {
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
        if (this.containsBlockedDate(this.selectedInterval)) {
          this.selectedInterval = oldInterval;
          return;
        }
        this.refresh.next(null);
        this.model.date = this.selectedInterval;
        return;
      }

      if (closestIndexTo(day.date, [this.selectedInterval.start, this.selectedInterval.end]) === 0) {
        this.selectedInterval.start = day.date;
        if (this.containsBlockedDate(this.selectedInterval)) {
          this.selectedInterval = oldInterval;
          return;
        }
        this.refresh.next(null);
        this.model.date = this.selectedInterval;
        return;
      } else {
        this.selectedInterval.end = day.date;
        if (this.containsBlockedDate(this.selectedInterval)) {
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
        day.cssClass = 'cal-day-selected';
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

  resolved(captchaResponse: string) {
    if (captchaResponse === null) {
      return;
    }
    fetch('https://us-central1-audio4live-1d621.cloudfunctions.net/verify?response=' + captchaResponse)
      .then((resp) => {
        if (resp.ok) {
          this.captchaResponse = captchaResponse;
        } else {
          this.captchaResponse = '';
        }
      })
      .catch(() => (this.captchaResponse = ''));
  }

  onSubmit(): void {
    this.submitService.submitForm(this.model).subscribe((_) => {
      this.alert.nativeElement.classList.add('show');
      this.alert.nativeElement.classList.remove('d-none');
      setTimeout(() => {
        this.alert.nativeElement.classList.remove('show');
        this.alert.nativeElement.classList.add('d-none');
      }, 10000);

      this.model = new Buchung();
      this.selectedInterval = undefined;
      this.captchaResponse = '';
      this.refresh.next(null);
    });
  }
}
