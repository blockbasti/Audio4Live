import { Functions, httpsCallable } from 'firebase/functions';
import { Observable } from 'rxjs';
import { currentZone, runInZone } from './zone';

/**
 * Replacement for `httpsCallableData` from `@angular/fire/functions`. Returns a function that
 * invokes the callable and emits only its `data` payload, mirroring the previous behaviour.
 *
 * Must be called from an injection context (e.g. a component constructor) so that emissions can be
 * delivered inside the Angular zone.
 */
export function httpsCallableData<TRequest = unknown, TResponse = unknown>(
  functions: Functions,
  name: string
): (data?: TRequest) => Observable<TResponse> {
  const zone = currentZone();
  const callable = httpsCallable<TRequest, TResponse>(functions, name);

  return (data?: TRequest) =>
    new Observable<TResponse>((subscriber) => {
      let cancelled = false;

      callable(data).then(
        (result) => {
          if (cancelled) return;
          runInZone(zone, () => {
            subscriber.next(result.data);
            subscriber.complete();
          });
        },
        (error) => {
          if (cancelled) return;
          runInZone(zone, () => subscriber.error(error));
        }
      );

      return () => {
        cancelled = true;
      };
    });
}
