import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PreloadImgService } from '../../preload-img.service';

@Component({
  selector: 'app-profil',

  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
})
export class ProfilComponent {
  constructor(private readonly preloadService: PreloadImgService, readonly titleService: Title) {
    titleService.setTitle('Über mich - Audio4Live');
  }

  loaded() {
    this.preloadService.preloadImages();
    document.getElementById('loader')?.classList.add('hidden');
    setTimeout(() => {
      document.getElementById('loader')?.remove();
    }, 2000);
  }
}
