import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardsModule } from 'angular-bootstrap-md';
import { ProfilRoutingModule } from './profil-routing.module';
import { ProfilComponent } from './profil.component';

@NgModule({
  declarations: [ProfilComponent],
  imports: [CommonModule, ProfilRoutingModule, CardsModule],
})
export class ProfilModule {}
