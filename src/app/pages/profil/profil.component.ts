import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html'
})
export class ProfilComponent {
  constructor(readonly titleService: Title) {
    titleService.setTitle('Über mich - Audio4Live');
  }
}
