import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';


const routes: Routes = [{path: '', loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)},
  { path: 'anfragen', loadChildren: () => import('./buchen/buchen.module').then(m => m.BuchenModule) },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
