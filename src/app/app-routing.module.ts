import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';


const routes: Routes = [{path: '', loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)},
  { path: 'buchen', loadChildren: () => import('./buchen/buchen.module').then(m => m.BuchenModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top',
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
