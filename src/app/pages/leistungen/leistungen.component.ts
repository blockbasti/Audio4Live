import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-leistungen',
  templateUrl: './leistungen.component.html'
})
export class LeistungenComponent {
  constructor(readonly titleService: Title) {
    titleService.setTitle('Leistungen - Audio4Live');
  }
}
