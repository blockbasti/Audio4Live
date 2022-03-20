import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [NavbarComponent, FooterComponent],
  imports: [CommonModule, RouterModule, MdbModalModule, MdbCollapseModule],
  exports: [NavbarComponent, FooterComponent, RouterModule, MdbModalModule],
})
export class SharedModule {}
