import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';
import { CardsModule, ButtonsModule } from 'angular-bootstrap-md';

@NgModule({
  declarations: [LandingComponent],
  imports: [CommonModule, LandingRoutingModule, CardsModule, ButtonsModule],
})
export class LandingModule {}
