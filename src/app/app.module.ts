import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { LeistungenComponent } from './leistungen/leistungen.component';
import { ProfilComponent } from './profil/profil.component';
import { ReferenzenComponent } from './referenzen/referenzen.component';
import { BuchenComponent } from './buchen/buchen.component';
import { LandingComponent } from './landing/landing.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ReferenzenComponent,
    BuchenComponent,
    LandingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    AppRoutingModule,
    RouterModule.forRoot([
      { path: '', component: LandingComponent, data: {animation: 'LandingPage'} },
      { path: 'leistungen', component: LeistungenComponent,data: {animation: 'LeistungenPage'} },
      { path: 'profil', component: ProfilComponent, data: {animation: 'ProfilPage'} },
      { path: 'buchen', component: BuchenComponent, data: {animation: 'BuchenPage'} },
      { path: 'referenzen', component: ReferenzenComponent, data: {animation: 'ReferenzenPage'} },
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
