import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { DatenschutzComponent } from './datenschutz/datenschutz.component';
import { FooterComponent } from './footer/footer.component';
import { ImpressumComponent } from './impressum/impressum.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [NavbarComponent, FooterComponent, /* DatenschutzComponent, ImpressumComponent */],
  imports: [CommonModule, RouterModule, MdbModalModule],
  exports: [NavbarComponent, FooterComponent, /* DatenschutzComponent, ImpressumComponent, */ RouterModule, MdbModalModule],
})
export class SharedModule {}
