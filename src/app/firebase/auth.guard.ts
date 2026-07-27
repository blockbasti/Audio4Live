import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { authState } from './auth-state';
import { firebaseAuth } from './firebase.providers';

// Replacement for `AuthGuard` + `redirectUnauthorizedTo`/`redirectLoggedInTo` from
// `@angular/fire/auth-guard`, as functional guards.
//
// The Auth instance is resolved through the memoised factory rather than through DI so that these
// guards do not depend on where in the route tree `provideFirebase()` was applied.

function guard(allow: (signedIn: boolean) => boolean, redirect: string[]): CanActivateFn {
  return (): Observable<boolean | UrlTree> => {
    const router = inject(Router);

    return authState(firebaseAuth()).pipe(
      take(1),
      map((user) => allow(!!user) || router.createUrlTree(redirect))
    );
  };
}

export function redirectUnauthorizedTo(redirect: string[]): CanActivateFn {
  return guard((signedIn) => signedIn, redirect);
}

export function redirectLoggedInTo(redirect: string[]): CanActivateFn {
  return guard((signedIn) => !signedIn, redirect);
}
