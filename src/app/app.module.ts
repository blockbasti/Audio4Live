import { BrowserModule } from '@angular/platform-browser';
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
    FontAwesomeModule,
    AppRoutingModule,
    RouterModule.forRoot([
      { path: '', component: LandingComponent },
      { path: 'leistungen', component: LeistungenComponent },
      { path: 'profil', component: ProfilComponent },
      { path: 'buchen', component: BuchenComponent },
      { path: 'referenzen', component: ReferenzenComponent },
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
