import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { Observable } from 'rxjs';
import { changeDetectionNotifier } from './change-detection';

/**
 * Replacement for `user()`/`authState()` from `@angular/fire/auth`.
 *
 * Firebase defers the first callback until persisted credentials have been restored, so the first
 * emission is always the resolved sign-in state - which is what the route guards rely on.
 *
 * Must be called from an injection context so that emissions can trigger change detection.
 */
export function authState(auth: Auth): Observable<User | null> {
  const notify = changeDetectionNotifier();

  return new Observable<User | null>((subscriber) =>
    onAuthStateChanged(
      auth,
      (user) => {
        subscriber.next(user);
        notify();
      },
      (error) => {
        subscriber.error(error);
        notify();
      }
    )
  );
}
