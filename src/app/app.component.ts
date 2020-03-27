import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from './animations';
import { ConsentModalService } from './shared/consent-modal.service';
import { PreloadImgService } from './preload-img.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    slideInAnimation
    // animation triggers go here
  ]
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'audio4live';

  modalService: ConsentModalService;

  preloadService: PreloadImgService;

  constructor(modalService: ConsentModalService, preloadImageService: PreloadImgService) {
    this.modalService = modalService;
    this.preloadService = preloadImageService;
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    if (localStorage.getItem('enableAnalytics') === null) {
      this.modalService.showModal();
    }
    this.preloadService.preloadImages();
  }
}
