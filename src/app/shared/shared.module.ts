import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { RouterModule } from '@angular/router';
import { ButtonsModule, CardsModule, IconsModule, ModalModule, NavbarModule } from 'angular-bootstrap-md';
import { ConsentComponent } from './consent/consent.component';
import { DatenschutzComponent } from './datenschutz/datenschutz.component';
import { FooterComponent } from './footer/footer.component';
import { ImpressumComponent } from './impressum/impressum.component';
import { NavbarComponent } from './navbar/navbar.component';

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
