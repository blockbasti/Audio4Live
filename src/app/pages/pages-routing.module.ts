import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./landing/landing.module').then((m) => m.LandingModule),
    data: { animation: 'LandingPage' }
  },
  {
    path: 'profil',
    loadChildren: () => import('./profil/profil.module').then((m) => m.ProfilModule),
    data: { animation: 'ProfilPage', openPrivacy: false }
  },
  {
    path: 'datenschutz',
    loadChildren: () => import('./landing/landing.module').then((m) => m.LandingModule),
    data: { animation: 'LandingPage', openPrivacy: true }
  },
  {
    path: 'impressum',
    loadChildren: () => import('./landing/landing.module').then((m) => m.LandingModule),
    data: { animation: 'LandingPage', openImprint: true }
  },
  {
    path: 'leistungen',
    loadChildren: () => import('./leistungen/leistungen.module').then((m) => m.LeistungenModule),
    data: { animation: 'LeistungenPage' }
  },
  {
    path: 'agb',
    loadChildren: () => import('./landing/landing.module').then((m) => m.LandingModule),
    data: { animation: 'LandingPage', openAGB: true }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
