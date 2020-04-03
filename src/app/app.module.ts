import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireAnalyticsModule, ScreenTrackingService, CONFIG, COLLECTION_ENABLED } from '@angular/fire/analytics';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule
  ],
  providers: [{
    provide: CONFIG, useValue: {
      send_page_view: true,
      allow_ad_personalization_signals: false,
      anonymize_ip: true
    },
  },
  { provide: COLLECTION_ENABLED, useValue: (localStorage.getItem('enableAnalytics') === 'true') },
    ScreenTrackingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
