import { Functions, httpsCallable } from 'firebase/functions';
import { Observable } from 'rxjs';
import { changeDetectionNotifier } from './change-detection';

/**
 * Replacement for `httpsCallableData` from `@angular/fire/functions`. Returns a function that
 * invokes the callable and emits only its `data` payload, mirroring the previous behaviour.
 *
 * Must be called from an injection context (e.g. a component constructor) so that emissions can
 * trigger change detection.
 */
export function httpsCallableData<TRequest = unknown, TResponse = unknown>(
  functions: Functions,
  name: string
): (data?: TRequest) => Observable<TResponse> {
  const notify = changeDetectionNotifier();
  const callable = httpsCallable<TRequest, TResponse>(functions, name);

  return (data?: TRequest) =>
    new Observable<TResponse>((subscriber) => {
      let cancelled = false;

      callable(data).then(
        (result) => {
          if (cancelled) return;
          subscriber.next(result.data);
          subscriber.complete();
          notify();
        },
        (error) => {
          if (cancelled) return;
          subscriber.error(error);
          notify();
        }
      );

      return () => {
        cancelled = true;
      };
    });
}
