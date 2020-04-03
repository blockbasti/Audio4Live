import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';

import { BuchenRoutingModule } from './buchen-routing.module';
import { BuchenComponent } from './buchen.component';

import { FormsModule } from '@angular/forms';

import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';

import localeDe from '@angular/common/locales/de';
registerLocaleData(localeDe);

import { ButtonsModule, CardsModule, ModalModule, IconsModule, InputsModule } from 'angular-bootstrap-md';

import { RecaptchaModule , RecaptchaFormsModule, RECAPTCHA_LANGUAGE } from 'ng-recaptcha';

@NgModule({
  declarations: [BuchenComponent],
  imports: [
    CommonModule,
    BuchenRoutingModule,
    FormsModule,
    NgxMaterialTimepickerModule.setLocale('de-DE'),
    ButtonsModule,
    CardsModule,
    IconsModule,
    InputsModule,
    ModalModule.forRoot(),
    AngularFirestoreModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    AngularFireAnalyticsModule,
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  providers: [
    {
      provide: RECAPTCHA_LANGUAGE,
      useValue: 'de',
    }
  ],
})
export class BuchenModule { }
