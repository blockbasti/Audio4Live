import { Component, OnInit, ViewChild } from '@angular/core';
import { ConsentModalService } from '../consent-modal.service';
import { ModalDirective } from 'angular-bootstrap-md/lib/free/modals/modal.directive';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Component({
  selector: 'app-consent',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.scss'],
})
export class ConsentComponent implements OnInit {
  @ViewChild('consentModal', { static: true })
  consentModal: ModalDirective;

  modalService: ConsentModalService;
  analytics: AngularFireAnalytics;

  constructor(modalService: ConsentModalService, analytics: AngularFireAnalytics) {
    this.modalService = modalService;
    this.analytics = analytics;
  }

  ngOnInit(): void {
    this.modalService.setModal(this.consentModal);
  }

  deny() {
    this.analytics.setAnalyticsCollectionEnabled(false);
    localStorage.setItem('enableAnalytics', 'false');
    this.consentModal.hide();
  }

  allow() {
    this.analytics.setAnalyticsCollectionEnabled(true);
    localStorage.setItem('enableAnalytics', 'true');
    this.consentModal.hide();
  }
}
