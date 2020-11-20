import { Component, ViewEncapsulation } from '@angular/core';
import { PreloadImgService } from '../../preload-img.service';

@Component({
  selector: 'app-profil',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
})
export class ProfilComponent {
  constructor(private preloadService: PreloadImgService) {}

  loaded() {
    this.preloadService.preloadImages();
    document.getElementById('loader')?.classList.add('hidden');
    setTimeout(() => {
      document.getElementById('loader')?.remove();
    }, 2000);
  }
}
