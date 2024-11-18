import { CommonModule, registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { FirestoreModule, connectFirestoreEmulator, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FunctionsModule, connectFunctionsEmulator, getFunctions, provideFunctions } from '@angular/fire/functions';
import { FormsModule } from '@angular/forms';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { RECAPTCHA_LANGUAGE, RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha-2';
import { NgxMaterialTimepickerModule, TIME_LOCALE } from 'ngx-material-timepicker';
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
    FormsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    NgxMaterialTimepickerModule.setOpts('de-DE'),
    MdbFormsModule,
    MdbModalModule,
    MdbCheckboxModule,
    FirestoreModule,
    FunctionsModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })
  ],
  providers: [
    {
      provide: RECAPTCHA_LANGUAGE,
      useValue: 'de'
    },
    {
      provide: TIME_LOCALE,
      useValue: 'de-DE'
    },
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
    provideFirebaseApp(() => initializeApp(environment.firebase))
  ]
})
export class BuchenModule {}
