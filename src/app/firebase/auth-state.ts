import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { Observable } from 'rxjs';
import { currentZone, runInZone } from './zone';

/**
 * Replacement for `user()`/`authState()` from `@angular/fire/auth`.
 *
 * Firebase defers the first callback until persisted credentials have been restored, so the first
 * emission is always the resolved sign-in state - which is what the route guards rely on.
 *
 * Must be called from an injection context so that emissions can be delivered inside the Angular
 * zone.
 */
export function authState(auth: Auth): Observable<User | null> {
  const zone = currentZone();

  return new Observable<User | null>((subscriber) =>
    onAuthStateChanged(
      auth,
      (user) => runInZone(zone, () => subscriber.next(user)),
      (error) => runInZone(zone, () => subscriber.error(error))
    )
  );
}
