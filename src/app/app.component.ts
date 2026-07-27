import { AfterViewInit, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, Router, RoutesRecognized } from '@angular/router';
import { filter } from 'rxjs/operators';

// Order of the top level pages, used to decide whether a navigation moves forward or backward
// through the site. The direction is exposed as a class on <html> so that the CSS view transition
// in `styles.scss` can slide the pages in the matching direction - this replaces the deprecated
// `@angular/animations` route trigger that used to do the same via `:enter`/`:leave` queries.
const PAGE_ORDER = ['LandingPage', 'BuchenPage', 'LeistungenPage', 'ProfilPage', 'ReferenzenPage'];

function pageOf(root: ActivatedRouteSnapshot): string | undefined {
  let route = root;
  while (route.firstChild) {
    route = route.firstChild;
  }
  return route.data['animation'];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent implements AfterViewInit {
  private currentPage: string | undefined;

  constructor() {
    inject(Router)
      .events.pipe(
        filter((event): event is RoutesRecognized => event instanceof RoutesRecognized),
        takeUntilDestroyed()
      )
      .subscribe((event) => {
        const nextPage = pageOf(event.state.root);
        const goingBack = PAGE_ORDER.indexOf(this.currentPage) > PAGE_ORDER.indexOf(nextPage);
        document.documentElement.classList.toggle('nav-back', goingBack);
        this.currentPage = nextPage;
      });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      document.getElementById('loader')?.classList.add('hidden');
      setTimeout(() => {
        document.getElementById('loader')?.remove();
      }, 2000);
    }, 300);
  }
}
