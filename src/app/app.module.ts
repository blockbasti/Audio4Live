import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, SharedModule],
  // Angular 21 bootstraps zoneless by default. The Firebase helpers in `src/app/firebase`
  // deliver their emissions by re-entering the Angular zone, so keep zone-based change detection.
  providers: [Title, provideZoneChangeDetection()],
  bootstrap: [AppComponent]
})
export class AppModule {}
