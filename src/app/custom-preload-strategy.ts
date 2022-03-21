import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

export class CustomPreloadStrategy implements PreloadingStrategy {
  preload(route: Route, load: Function): Observable<any> {
    const shouldPreload = () => {
      var connection = (navigator as any).connection;
      if (connection && route.path != 'admin') {
        if (
          connection.effectiveType === '3g' ||
          connection.effectiveType === '2g' ||
          connection.effectiveType === 'slow-2g' ||
          connection.dataSaver
        )
          return false;
        return true;
      } else {
        return false;
      }
    };

    return shouldPreload() ? load() : of(null);
  }
}
