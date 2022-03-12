import { AfterContentInit, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from './animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [slideInAnimation],
})
export class AppComponent implements AfterContentInit {
  title = 'audio4live';

  constructor() {}

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  ngAfterContentInit() {
    setTimeout(() => {
      document.getElementById('loader')?.classList.add('hidden');
      setTimeout(() => {
        document.getElementById('loader')?.remove();
      }, 2000);
    }, 1500);
  }
}
