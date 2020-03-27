import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreloadImgService {

  constructor() { }

  private images = [
    '/assets/images/header.jpg',
    '/assets/images/header2.jpg',
    '/assets/images/header3.jpg',
    '/assets/images/header4.jpg',
  ]

  preloadImages(){
    this.images.forEach(img => {
      const image = new Image();
      image.src = img;
    });
  }
}
