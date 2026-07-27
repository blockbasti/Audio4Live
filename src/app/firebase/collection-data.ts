import { Query, onSnapshot } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { currentZone, runInZone } from './zone';

/**
 * Replacement for `collectionData` from `@angular/fire/firestore`.
 *
 * Must be called from an injection context (e.g. a component constructor) so that emissions can be
 * delivered inside the Angular zone.
 */
export function collectionData<T>(query: Query<T>, options: { idField?: string } = {}): Observable<T[]> {
  const zone = currentZone();

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
        runInZone(zone, () => subscriber.next(items));
      },
      (error) => runInZone(zone, () => subscriber.error(error))
    );

    return unsubscribe;
  });
}
