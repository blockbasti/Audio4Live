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
export class AppComponent implements OnInit, AfterViewInit {
  title = 'audio4live';

  modalService: ConsentModalService;

  

  constructor(modalService: ConsentModalService) {
    this.modalService = modalService;
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  ngOnInit() {
    /* let images = [
      'https://placekitten.com/300/400',
      '../assets/images/header.jpg',
      '../assets/images/header2.jpg',
      '../assets/images/header3.jpg',
    ];
    images.forEach(img => {
      let image = new Image();
      image.src = img;
    }); */
  }

  ngAfterViewInit(): void {
    if (localStorage.getItem('enableAnalytics') === null) {
      this.modalService.showModal();
    }
  }
}
