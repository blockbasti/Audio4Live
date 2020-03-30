import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { BuchenRoutingModule } from './buchen-routing.module';
import { BuchenComponent } from './buchen.component';

import { FormsModule } from '@angular/forms';

import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { AngularFirestoreModule } from '@angular/fire/firestore';

import localeDe from '@angular/common/locales/de';
import { ButtonsModule, CardsModule, ModalModule, IconsModule, InputsModule } from 'angular-bootstrap-md';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
registerLocaleData(localeDe);


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
    HttpClientModule,
    AngularFirestoreModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    AngularFireAnalyticsModule
  ],
  exports:  [
    BuchenComponent
  ]
})
export class BuchenModule { }
