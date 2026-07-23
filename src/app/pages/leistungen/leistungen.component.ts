import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-leistungen',
    templateUrl: './leistungen.component.html',
    standalone: false
})
export class LeistungenComponent {
  constructor(readonly titleService: Title) {
    titleService.setTitle('Leistungen - Audio4Live');
  }
}
