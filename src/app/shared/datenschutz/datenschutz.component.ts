import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md/lib/free/modals/modal.directive';
import { DatenschutzModalService } from '../datenschutz-modal.service';

@Component({
  selector: 'app-datenschutz',
  templateUrl: './datenschutz.component.html',
  styleUrls: ['./datenschutz.component.scss'],
})
export class DatenschutzComponent implements OnInit {
  @ViewChild('datenschutzModal', { static: true })
  datenschutzModal: ModalDirective;

  modalService: DatenschutzModalService;

  constructor(modalService: DatenschutzModalService) {
    this.modalService = modalService;
  }

  ngOnInit(): void {
    this.modalService.setModal(this.datenschutzModal);
  }
}
