import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from './animations';
import { ConsentModalService } from '../app/consent-modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    slideInAnimation
    // animation triggers go here
  ]
})
export class AppComponent implements AfterViewInit {
  title = 'audio4live';

  modalService: ConsentModalService;

  constructor(modalService: ConsentModalService) {
    this.modalService = modalService;
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  ngAfterViewInit(): void {
    if (localStorage.getItem('enableAnalytics') === null) {
      this.modalService.showModal();
    }
  }
}
