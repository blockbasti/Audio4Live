import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md/lib/free/modals/modal.directive';
import { ImpressumModalService } from '../impressum-modal.service';

@Component({
  selector: 'app-impressum',
  templateUrl: './impressum.component.html',
  styleUrls: ['./impressum.component.scss']
})
export class ImpressumComponent implements OnInit {
  @ViewChild('impressumModal', { static: true })
  impressumModal: ModalDirective;

  modalService: ImpressumModalService;

  constructor(modalService: ImpressumModalService) {
    this.modalService = modalService;
  }

  ngOnInit(): void {
    this.modalService.setModal(this.impressumModal);
  }

}
