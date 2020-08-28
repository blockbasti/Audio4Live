import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PreloadImgService {
  constructor() {}

  private images = ['speaker1', 'speaker2', 'drums', 'fader', 'colors', 'profil'];

  preloadImages() {
    this.images.forEach((img) => {
      const image = new Image();
      image.src = '/assets/images/' + img + '.webp';
    });
  }
}
