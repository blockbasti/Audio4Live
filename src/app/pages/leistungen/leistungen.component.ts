import { Component, ViewEncapsulation } from '@angular/core';
import { PreloadImgService } from '../../preload-img.service';

@Component({
  selector: 'app-leistungen',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './leistungen.component.html',
  styleUrls: ['./leistungen.component.scss'],
})
export class LeistungenComponent {
  constructor(private PreloadImgService: PreloadImgService) {}

  loaded() {
    this.PreloadImgService.preloadImages();
    document.getElementById('loader')?.classList.add('hidden');
    setTimeout(() => {
      document.getElementById('loader')?.remove();
    }, 2000);
  }
}
