import { Component } from '@angular/core';
import { DatenschutzModalService } from '../datenschutz-modal.service';
import { ImpressumModalService } from '../impressum-modal.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  datenschutzModalService: DatenschutzModalService;
  impressumModalService: ImpressumModalService;

  constructor(datenschutzModalService: DatenschutzModalService, impressumModalService: ImpressumModalService) {
    this.datenschutzModalService = datenschutzModalService;
    this.impressumModalService = impressumModalService;
  }

  openDatenschutzModal() {
    this.datenschutzModalService.showModal();
  }

  openImpressumModal() {
    this.impressumModalService.showModal();
  }
}
