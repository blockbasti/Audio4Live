import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonsModule, CardsModule, IconsModule, ModalModule, NavbarModule } from 'angular-bootstrap-md';
import { DatenschutzComponent } from './datenschutz/datenschutz.component';
import { FooterComponent } from './footer/footer.component';
import { ImpressumComponent } from './impressum/impressum.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [NavbarComponent, FooterComponent, DatenschutzComponent, ImpressumComponent],
  imports: [CommonModule, RouterModule, CardsModule, ModalModule.forRoot(), NavbarModule, IconsModule, ButtonsModule],
  exports: [NavbarComponent, FooterComponent, DatenschutzComponent, ImpressumComponent, RouterModule],
})
export class SharedModule {}
