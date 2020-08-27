import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { AngularFireAnalytics } from '@angular/fire/analytics';

@Component({
  selector: 'app-consent',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.scss'],
})
export class ConsentComponent implements AfterViewInit {
  @ViewChild('consent', { read: ElementRef }) card: ElementRef<HTMLDivElement>;

  analytics: AngularFireAnalytics;

  constructor(analytics: AngularFireAnalytics) {
    this.analytics = analytics;
  }

  ngAfterViewInit(): void {
    if (localStorage.getItem('enableAnalytics') === null) this.card.nativeElement.classList.add('d-flex');
    else this.card.nativeElement.classList.add('d-none');
  }

  deny() {
    this.analytics.setAnalyticsCollectionEnabled(false);
    localStorage.setItem('enableAnalytics', 'false');
    this.card.nativeElement.classList.remove('d-flex');
    this.card.nativeElement.classList.add('d-none');
  }

  allow() {
    this.analytics.setAnalyticsCollectionEnabled(true);
    localStorage.setItem('enableAnalytics', 'true');
    this.card.nativeElement.classList.remove('d-flex');
    this.card.nativeElement.classList.add('d-none');
  }
}
