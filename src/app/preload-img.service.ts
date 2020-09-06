import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PreloadImgService {
  constructor() {}

  private images = [/* 'speaker2', */ 'speaker1', 'drums', 'fader' /* 'colors' */, , 'profil'];

  preloadImages() {
    const format = document.documentElement.classList.contains('webp') ? '.webp' : '.jpg';
    this.images.forEach((img) => {
      const image = new Image();
      image.src = '/assets/images/' + img + format;
    });
  }
}
