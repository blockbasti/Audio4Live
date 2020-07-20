import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md/lib/free/modals/modal.directive';
import { DatenschutzModalService } from '../datenschutz-modal.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Component({
  selector: 'app-datenschutz',
  templateUrl: './datenschutz.component.html',
  styleUrls: ['./datenschutz.component.scss'],
})
export class DatenschutzComponent implements OnInit {
  @ViewChild('datenschutzModal', { static: true })
  datenschutzModal: ModalDirective;

  modalService: DatenschutzModalService;
  analytics: AngularFireAnalytics;

  constructor(modalService: DatenschutzModalService, analytics: AngularFireAnalytics) {
    this.modalService = modalService;
    this.analytics = analytics;
  }

  ngOnInit(): void {
    this.modalService.setModal(this.datenschutzModal);
  }

  disableAnalytics() {
    localStorage.setItem('enableAnalytics', 'false');
    this.analytics.setAnalyticsCollectionEnabled(false);
    alert('Google Analytics wurde deaktiviert!');
  }
}
