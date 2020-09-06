import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonsModule, CardsModule, CarouselModule, IconsModule } from 'angular-bootstrap-md';
import { PagesRoutingModule } from './pages-routing.module';

@NgModule({
  imports: [CommonModule, PagesRoutingModule, CardsModule, ButtonsModule, IconsModule, CarouselModule],
})
export class PagesModule {}
