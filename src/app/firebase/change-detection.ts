import { ChangeDetectorRef, DestroyRef, inject } from '@angular/core';

// The plain `firebase` SDK invokes its callbacks outside of anything Angular knows about, whereas
// `@angular/fire` used to wrap every API in `ɵzoneWrap`. The app runs zoneless, so there is no zone
// left to re-enter either - instead the `ChangeDetectorRef` of the surrounding component is
// captured and marked for check after every emission, which also notifies the zoneless scheduler.
//
// The `ChangeDetectorRef` is resolved eagerly while still in an injection context - the emissions
// themselves happen long after the component constructor has returned.

/**
 * Returns a callback that schedules change detection for the component this was created in.
 *
 * Outside of a component (e.g. inside a route guard) there is no `ChangeDetectorRef`. Those call
 * sites do not render anything themselves, so notifying nothing is correct.
 */
export function changeDetectionNotifier(): () => void {
  const changeDetector = inject(ChangeDetectorRef, { optional: true });
  if (!changeDetector) {
    return () => {};
  }

  // Firebase keeps pushing snapshots until the subscription is torn down, which these call sites
  // deliberately never do; marking an already destroyed view would throw.
  let destroyed = false;
  inject(DestroyRef, { optional: true })?.onDestroy(() => (destroyed = true));

  return () => {
    if (!destroyed) {
      changeDetector.markForCheck();
    }
  };
}
