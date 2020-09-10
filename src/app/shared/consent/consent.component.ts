import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Component({
  selector: 'app-consent',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.scss'],
})
export class ConsentComponent implements AfterViewInit {
  @ViewChild('consent', { read: ElementRef }) card: ElementRef<HTMLDivElement>;

  @ViewChild('btnAccept', { read: ElementRef }) accept: ElementRef<HTMLButtonElement>;
  analytics: AngularFireAnalytics;

  constructor(analytics: AngularFireAnalytics) {
    this.analytics = analytics;
  }

  ngAfterViewInit(): void {
    if (localStorage.getItem('enableAnalytics') === null) {
      this.card.nativeElement.classList.add('d-flex');
      this.accept.nativeElement.focus();
    } else {
      this.card.nativeElement.remove();
    }
  }

  deny() {
    this.analytics.setAnalyticsCollectionEnabled(false);
    localStorage.setItem('enableAnalytics', 'false');
    this.card.nativeElement.remove();
  }

  allow() {
    this.analytics.setAnalyticsCollectionEnabled(true);
    localStorage.setItem('enableAnalytics', 'true');
    this.card.nativeElement.remove();
  }
}
