import { NgModule, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, SharedModule],
  // The app runs without zone.js. Anything that changes component state from outside Angular
  // (the Firebase SDK, grecaptcha, Quill) has to notify change detection itself - see the helpers
  // in `src/app/firebase` and the `markForCheck()` calls at those call sites.
  providers: [Title, provideZonelessChangeDetection()],
  bootstrap: [AppComponent]
})
export class AppModule {}
