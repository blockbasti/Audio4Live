import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class PreloadImgService {
  constructor() {}

  hasPreloaded = false;

  private images = ['speaker1', 'speaker2', 'drums', 'fader' ,'profil'];

  preloadImages() {
    if (this.hasPreloaded) return;
    var connection = (navigator as any).connection;
    if (connection) {
      if (
        connection.effectiveType === '3g' ||
        connection.effectiveType === '2g' ||
        connection.effectiveType === 'slow-2g' ||
        connection.dataSaver
      )
        return;
    }
    const format = document.documentElement.classList.contains('webp') ? '.webp' : '.jpg';
    this.images.forEach((img) => {
      const image = new Image();
      image.src = '/assets/images/' + img + format;
    });
    this.hasPreloaded = true;
  }
}
