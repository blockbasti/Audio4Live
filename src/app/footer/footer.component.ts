import { Component, OnInit } from '@angular/core';
import { DatenschutzModalService} from '../datenschutz-modal.service';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  modalService: DatenschutzModalService;


  constructor(modalService: DatenschutzModalService) {
    this.modalService = modalService;
  }

  ngOnInit(): void {
  }

  openModal() {
    this.modalService.showModal();
  }

}
