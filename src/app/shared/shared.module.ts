import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CardsModule, ModalModule, NavbarModule, IconsModule, ButtonsModule } from 'angular-bootstrap-md';

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { DatenschutzComponent } from './datenschutz/datenschutz.component';
import { ConsentComponent } from './consent/consent.component';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { ImpressumComponent } from './impressum/impressum.component';

@NgModule({
  declarations: [NavbarComponent, FooterComponent, DatenschutzComponent, ImpressumComponent, ConsentComponent],
  imports: [
    CommonModule,
    RouterModule,
    // MDBBootstrapModule.forRoot(),
    CardsModule,
    ModalModule.forRoot(),
    NavbarModule,
    IconsModule,
    ButtonsModule,
    AngularFireAnalyticsModule,
  ],
  exports: [NavbarComponent, FooterComponent, DatenschutzComponent, ImpressumComponent, ConsentComponent, RouterModule],
})
export class SharedModule {}
