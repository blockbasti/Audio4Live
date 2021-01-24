import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserModule, Title} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ɵe as TIME_LOCALE } from 'ngx-material-timepicker';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomPreloadStrategy } from './custom-preload-strategy';
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
  ],
  providers: [
    {
      provide: TIME_LOCALE,
      useValue: '',
    },
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    CustomPreloadStrategy,
    Title
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
