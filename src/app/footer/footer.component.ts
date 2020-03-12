import { Component, OnInit } from '@angular/core';
import { DatenschutzModalServiceService } from '../datenschutz-modal-service.service';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  modalService: DatenschutzModalServiceService;


  constructor(modalService: DatenschutzModalServiceService) {
    this.modalService = modalService;
  }

  ngOnInit(): void {
  }

  openModal() {
    this.modalService.showModal();
  }

}
