import { Injectable } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md/lib/free/modals/modal.directive';

@Injectable({
  providedIn: 'root'
})
export class ConsentModalService {
  consentModal: ModalDirective;

  constructor() { }

  setModal(modal: ModalDirective) {
    this.consentModal = modal;
  }

  showModal() {
    this.consentModal.show();
  }
}
