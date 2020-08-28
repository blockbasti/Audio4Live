import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';

import { CardsModule, ButtonsModule, IconsModule, CarouselModule } from 'angular-bootstrap-md';

@NgModule({
  imports: [CommonModule, PagesRoutingModule, CardsModule, ButtonsModule, IconsModule, CarouselModule],
})
export class PagesModule { }
