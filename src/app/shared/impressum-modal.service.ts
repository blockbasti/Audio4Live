import { Injectable } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md/lib/free/modals/modal.directive';

@Injectable({
  providedIn: 'root',
})
export class ImpressumModalService {
  impressumModal: ModalDirective;

  constructor() {}

  setModal(modal: ModalDirective) {
    this.impressumModal = modal;
  }

  showModal() {
    this.impressumModal.show();
  }
}
