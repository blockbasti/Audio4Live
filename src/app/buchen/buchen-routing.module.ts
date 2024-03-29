import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuchenComponent } from './buchen.component';

const routes: Routes = [{ path: '', component: BuchenComponent, data: { animation: 'BuchenPage' } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuchenRoutingModule {}
