import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireAnalyticsModule, ScreenTrackingService, CONFIG, COLLECTION_ENABLED } from '@angular/fire/analytics';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import localeDe from '@angular/common/locales/de';
registerLocaleData(localeDe);


import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { LeistungenComponent } from './leistungen/leistungen.component';
import { ProfilComponent } from './profil/profil.component';
import { ReferenzenComponent } from './referenzen/referenzen.component';
import { BuchenComponent } from './buchen/buchen.component';
import { LandingComponent } from './landing/landing.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FooterComponent } from './footer/footer.component';
import { DatenschutzComponent } from './datenschutz/datenschutz.component';
import { ConsentComponent } from './consent/consent.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { registerLocaleData } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ReferenzenComponent,
    BuchenComponent,
    LandingComponent,
    FooterComponent,
    DatenschutzComponent,
    ConsentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    RouterModule.forRoot([
      { path: '', component: LandingComponent, data: { animation: 'LandingPage' } },
      { path: 'leistungen', component: LeistungenComponent, data: { animation: 'LeistungenPage' } },
      { path: 'profil', component: ProfilComponent, data: { animation: 'ProfilPage' } },
      { path: 'buchen', component: BuchenComponent, data: { animation: 'BuchenPage' } },
      { path: 'referenzen', component: ReferenzenComponent, data: { animation: 'ReferenzenPage' } },
    ]),
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })
  ],
  providers: [{
    provide: CONFIG, useValue: {
      send_page_view: true,
      allow_ad_personalization_signals: false,
      anonymize_ip: true
    },
  },
  { provide: COLLECTION_ENABLED, useValue: (localStorage.getItem('enableAnalytics') === 'true')},
    ScreenTrackingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
