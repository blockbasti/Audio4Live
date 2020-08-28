import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeistungenComponent } from './leistungen.component';

const routes: Routes = [{ path: '', component: LeistungenComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeistungenRoutingModule { }
