import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from './animations';
import { PreloadImgService } from './preload-img.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    slideInAnimation,
    // animation triggers go here
  ],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'audio4live';


  preloadService: PreloadImgService;

  constructor(preloadImageService: PreloadImgService) {
    this.preloadService = preloadImageService;
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.preloadService.preloadImages();
  }
}
