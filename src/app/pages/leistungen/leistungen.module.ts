import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeistungenRoutingModule } from './leistungen-routing.module';
import { LeistungenComponent } from './leistungen.component';

import { CardsModule } from 'angular-bootstrap-md';


@NgModule({
  declarations: [LeistungenComponent],
  imports: [
    CommonModule,
    LeistungenRoutingModule,
    CardsModule
  ]
})
export class LeistungenModule { }
