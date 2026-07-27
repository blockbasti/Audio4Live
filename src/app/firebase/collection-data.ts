import { Query, onSnapshot } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { changeDetectionNotifier } from './change-detection';

/**
 * Replacement for `collectionData` from `@angular/fire/firestore`.
 *
 * Must be called from an injection context (e.g. a component constructor) so that emissions can
 * trigger change detection.
 */
export function collectionData<T>(query: Query<T>, options: { idField?: string } = {}): Observable<T[]> {
  const notify = changeDetectionNotifier();

  return new Observable<T[]>((subscriber) => {
    const unsubscribe = onSnapshot(
      query,
      (snapshot) => {
        const items = snapshot.docs.map((document) => {
          const data = document.data();
          // Assign in place rather than spreading so that converters returning class instances
          // (such as `Blocker`) keep their prototype.
          if (options.idField && data && typeof data === 'object') {
            (data as Record<string, unknown>)[options.idField] = document.id;
          }
          return data;
        });
        subscriber.next(items);
        notify();
      },
      (error) => {
        subscriber.error(error);
        notify();
      }
    );

    return unsubscribe;
  });
}
