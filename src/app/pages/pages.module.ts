import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { PagesRoutingModule } from './pages-routing.module';

@NgModule({
  imports: [CommonModule, PagesRoutingModule, MdbCarouselModule],
})
export class PagesModule {}
