import { NgZone, inject } from '@angular/core';

// The plain `firebase` SDK invokes its callbacks outside the Angular zone, whereas `@angular/fire`
// used to wrap every API in `ɵzoneWrap`. Without re-entering the zone, snapshot/auth/callable
// emissions would not trigger change detection (`BuchenComponent` even runs with `OnPush`).
//
// The zone is captured eagerly while still in an injection context - the emissions themselves
// happen long after the component constructor has returned.

export function currentZone(): NgZone | null {
  return inject(NgZone, { optional: true });
}

export function runInZone(zone: NgZone | null, fn: () => void): void {
  if (zone) {
    zone.run(fn);
  } else {
    fn();
  }
}
