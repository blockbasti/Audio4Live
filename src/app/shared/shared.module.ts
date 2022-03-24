import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { QuicklinkModule } from 'ngx-quicklink';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [NavbarComponent, FooterComponent],
  imports: [CommonModule, RouterModule, MdbModalModule, MdbCollapseModule, QuicklinkModule],
  exports: [NavbarComponent, FooterComponent, RouterModule, MdbModalModule, QuicklinkModule],
})
export class SharedModule {}
