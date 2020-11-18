import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-leistungen',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './leistungen.component.html',
  styleUrls: ['./leistungen.component.scss'],
})
export class LeistungenComponent {
  constructor() {}

  loaded() {
    document.getElementById('loader')?.classList.add('hidden');
    setTimeout(() => {
      document.getElementById('loader')?.remove();
    }, 2000);
  }
}
