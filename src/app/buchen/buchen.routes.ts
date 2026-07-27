import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { Routes } from '@angular/router';
import { DateAdapter, provideCalendar } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NUMBERING_SYSTEM, TIME_LOCALE } from 'ngx-material-timepicker';
import { provideFirebase } from '../firebase/firebase.providers';
import { RECAPTCHA_LANGUAGE } from '../shared/recaptcha/recaptcha.component';
import { BuchenComponent } from './buchen.component';

registerLocaleData(localeDe);

export const buchenRoutes: Routes = [
  {
    path: '',
    component: BuchenComponent,
    data: { animation: 'BuchenPage' },
    providers: [
      provideFirebase(),
      provideCalendar({ provide: DateAdapter, useFactory: adapterFactory }),
      { provide: RECAPTCHA_LANGUAGE, useValue: 'de' },
      { provide: TIME_LOCALE, useValue: 'de-DE' },
      { provide: NUMBERING_SYSTEM, useValue: 'latn' }
    ]
  }
];

export default buchenRoutes;
