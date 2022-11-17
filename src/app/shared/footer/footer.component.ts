import { Component } from '@angular/core';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { AGBComponent } from '../agb/agb.component';
import { DatenschutzComponent } from '../datenschutz/datenschutz.component';
import { ImpressumComponent } from '../impressum/impressum.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  datenschutzModalRef: MdbModalRef<DatenschutzComponent> | null = null;
  impressumModalRef: MdbModalRef<ImpressumComponent> | null = null;
  AGBModalRef: MdbModalRef<AGBComponent> | null = null;

  config = {
    animation: true,
    backdrop: true,
    containerClass: 'right',
    ignoreBackdropClick: false,
    keyboard: true,
    modalClass: 'modal-top-right modal-dialog-scrollable'
  };

  constructor(private readonly modalService: MdbModalService) {}

  openDatenschutzModal() {
    this.datenschutzModalRef = this.modalService.open(DatenschutzComponent, this.config);
  }

  openImpressumModal() {
    this.impressumModalRef = this.modalService.open(ImpressumComponent, this.config);
  }

  openAGBModal() {
    this.AGBModalRef = this.modalService.open(AGBComponent, this.config);
  }
}
