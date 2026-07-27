import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './pages/error/error.component';

const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/pages.module').then((m) => m.PagesModule) },
  { path: 'anfragen', loadChildren: () => import('./buchen/buchen.routes') },
  { path: 'admin', loadChildren: () => import('./admin/admin.routes') },
  { path: '**', component: ErrorComponent, data: { animation: 'LandingPage' } }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
