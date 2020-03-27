import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeistungenComponent } from './leistungen/leistungen.component';
import { ProfilComponent } from './profil/profil.component';
import { ReferenzenComponent } from './referenzen/referenzen.component';
import { LandingComponent } from './landing/landing.component';

const routes: Routes = [{ path: 'profil', component: ProfilComponent, data: { animation: 'ProfilPage' } },
{ path: 'leistungen', component: LeistungenComponent, data: { animation: 'LeistungenPage' } },
{ path: 'referenzen', component: ReferenzenComponent, data: { animation: 'ReferenzenPage' } },
{ path: '', component: LandingComponent, data: { animation: 'LandingPage' } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
