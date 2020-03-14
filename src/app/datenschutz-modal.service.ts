import { Injectable } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md/lib/free/modals/modal.directive';

@Injectable({
  providedIn: 'root'
})
export class DatenschutzModalService {
  datenschutzModal: ModalDirective;

  constructor() { }

  setModal(modal: ModalDirective) {
    this.datenschutzModal = modal;
  }

  showModal() {
    this.datenschutzModal.show();
  }
}
