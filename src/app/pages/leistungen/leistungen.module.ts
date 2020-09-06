import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardsModule } from 'angular-bootstrap-md';
import { LeistungenRoutingModule } from './leistungen-routing.module';
import { LeistungenComponent } from './leistungen.component';

@NgModule({
  declarations: [LeistungenComponent],
  imports: [CommonModule, LeistungenRoutingModule, CardsModule],
})
export class LeistungenModule {}
