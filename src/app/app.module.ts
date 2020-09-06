import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule, COLLECTION_ENABLED, CONFIG, ScreenTrackingService } from '@angular/fire/analytics';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ɵe as TIME_LOCALE } from 'ngx-material-timepicker';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
  ],
  providers: [
    {
      provide: CONFIG,
      useValue: {
        send_page_view: true,
        allow_ad_personalization_signals: false,
        anonymize_ip: true,
      },
    },
    {
      provide: COLLECTION_ENABLED,
      useValue: localStorage.getItem('enableAnalytics') === 'true',
    },
    {
      provide: TIME_LOCALE,
      useValue: '',
    },
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    ScreenTrackingService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
