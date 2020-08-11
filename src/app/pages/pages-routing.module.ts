import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeistungenComponent } from './leistungen/leistungen.component';
import { ProfilComponent } from './profil/profil.component';
import { LandingComponent } from './landing/landing.component';

const routes: Routes = [
  { path: 'profil', component: ProfilComponent, data: { animation: 'ProfilPage', openPrivacy: false } },
  { path: 'leistungen', component: LeistungenComponent, data: { animation: 'LeistungenPage' } },
  { path: '', component: LandingComponent, data: { animation: 'LandingPage' } },
  { path: 'datenschutz', component: LandingComponent, data: { openPrivacy: true } },
  { path: 'impressum', component: LandingComponent, data: { openImprint: true } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
