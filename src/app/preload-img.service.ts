import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PreloadImgService {
  constructor() {}

  hasPreloaded = false;

  private images = ['speaker1', 'speaker2', 'drums', 'fader' /* 'colors' */, , 'profil'];

  preloadImages() {
    if (this.hasPreloaded) return;
    const format = document.documentElement.classList.contains('webp') ? '.webp' : '.jpg';
    this.images.forEach((img) => {
      const image = new Image();
      image.src = '/assets/images/' + img + format;
    });
    this.hasPreloaded = true;
  }
}
