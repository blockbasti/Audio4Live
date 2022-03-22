import { CommonModule, registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectFirestoreEmulator, FirestoreModule, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { connectFunctionsEmulator, FunctionsModule, getFunctions, provideFunctions } from '@angular/fire/functions';
import { FormsModule } from '@angular/forms';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { RecaptchaFormsModule, RecaptchaModule, RECAPTCHA_LANGUAGE } from 'ng-recaptcha';
import { NgxMaterialTimepickerModule, ɵe as TIME_LOCALE } from 'ngx-material-timepicker';
import { environment } from '../../environments/environment';
import { BuchenRoutingModule } from './buchen-routing.module';
import { BuchenComponent } from './buchen.component';

registerLocaleData(localeDe);

@NgModule({
  declarations: [BuchenComponent],
  imports: [
    CommonModule,
    BuchenRoutingModule,
    FormsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    NgxMaterialTimepickerModule.setLocale('de-DE'),
    MdbFormsModule,
    MdbModalModule,
    MdbCheckboxModule,
    FirestoreModule,
    FunctionsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFunctions(() => {
      const functions = getFunctions();
      if (environment.useEmulators) {
        connectFunctionsEmulator(functions, 'localhost', 5001);
      }
      return functions;
    }),
    provideFirestore(() => {
      const firestore = getFirestore();
      if (environment.useEmulators) {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      }
      return firestore;
    }),
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
  ],
  providers: [
    {
      provide: RECAPTCHA_LANGUAGE,
      useValue: 'de',
    },
    {
      provide: TIME_LOCALE,
      useValue: '',
    },
  ],
})
export class BuchenModule {}
