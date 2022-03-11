import { Component, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PreloadImgService } from '../../preload-img.service';

@Component({
  selector: 'app-leistungen',

  templateUrl: './leistungen.component.html',
  styleUrls: ['./leistungen.component.scss'],
})
export class LeistungenComponent {
  constructor(private PreloadImgService: PreloadImgService, titleService: Title) {
    titleService.setTitle('Leistungen - Audio4Live');
  }

  loaded() {
    this.PreloadImgService.preloadImages();
    document.getElementById('loader')?.classList.add('hidden');
    setTimeout(() => {
      document.getElementById('loader')?.remove();
    }, 2000);
  }
}
