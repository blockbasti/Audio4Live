import { CommonModule, registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { NgModule } from '@angular/core';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { FormsModule } from '@angular/forms';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { RecaptchaFormsModule, RecaptchaModule, RECAPTCHA_LANGUAGE } from 'ng-recaptcha';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
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
    AngularFirestoreModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
  ],
  providers: [
    {
      provide: RECAPTCHA_LANGUAGE,
      useValue: 'de',
    },
  ],
})
export class BuchenModule {}
