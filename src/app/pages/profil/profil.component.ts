import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-profil',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
})
export class ProfilComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

  @ViewChild('imgprofil') img: ElementRef;

  ngAfterViewInit(): void {
    if (document.documentElement.classList.contains('webp')) {
      this.img.nativeElement.src = this.img.nativeElement.getAttribute('data-webp');
    }
    else {
      this.img.nativeElement.src = this.img.nativeElement.getAttribute('data-jpg');
    }
  }
}
