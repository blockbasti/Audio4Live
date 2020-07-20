import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeistungenComponent } from './leistungen/leistungen.component';
import { ProfilComponent } from './profil/profil.component';
import { ReferenzenComponent } from './referenzen/referenzen.component';
import { LandingComponent } from './landing/landing.component';

import { PagesRoutingModule } from './pages-routing.module';

import { CardsModule, ButtonsModule, IconsModule, CarouselModule } from 'angular-bootstrap-md';

@NgModule({
  declarations: [ReferenzenComponent, LandingComponent, LeistungenComponent, ProfilComponent],
  imports: [CommonModule, PagesRoutingModule, CardsModule, ButtonsModule, IconsModule, CarouselModule],
  exports: [ReferenzenComponent, LandingComponent, LeistungenComponent, ProfilComponent],
})
export class PagesModule {}
