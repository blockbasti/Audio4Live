import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from './animations';
import { PreloadImgService } from './preload-img.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [slideInAnimation],
})
export class AppComponent implements OnInit {
  title = 'audio4live';

  preloadService: PreloadImgService;

  constructor(preloadImageService: PreloadImgService) {
    this.preloadService = preloadImageService;
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  ngOnInit() {
    this.preloadService.preloadImages();
    setTimeout(() => {
      document.getElementById('loader')?.classList.add('hidden');
      setTimeout(() => {
        document.getElementById('loader')?.remove();
      }, 2000);
    }, 10000);
  }
}
