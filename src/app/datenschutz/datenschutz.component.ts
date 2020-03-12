import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md/lib/free/modals/modal.directive';
import { DatenschutzModalServiceService } from '../datenschutz-modal-service.service';

@Component({
  selector: 'modal-datenschutz',
  templateUrl: './datenschutz.component.html',
  styleUrls: ['./datenschutz.component.scss']
})
export class DatenschutzComponent implements OnInit {
  @ViewChild('datenschutzModal', { static: true })
  datenschutzModal: ModalDirective;

  modalService: DatenschutzModalServiceService;

  constructor(modalService: DatenschutzModalServiceService) { 
    this.modalService = modalService;
  }

  ngOnInit(): void {
    this.modalService.setModal(this.datenschutzModal);
  }

}
