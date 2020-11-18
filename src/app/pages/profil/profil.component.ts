import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-profil',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
})
export class ProfilComponent {
  constructor() {}

  loaded() {
    document.getElementById('loader')?.classList.add('hidden');
    setTimeout(() => {
      document.getElementById('loader')?.remove();
    }, 2000);
  }
}
