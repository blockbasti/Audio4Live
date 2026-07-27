import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, connectAuthEmulator, getAuth } from 'firebase/auth';
import { Firestore, connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { Functions, connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { environment } from '../../environments/environment';

// Replacement for `@angular/fire` (removed - its stable releases only support @angular/core ^20,
// which blocked every further Angular upgrade). The plain `firebase` SDK is used directly; this
// file only supplies the Angular DI wiring that AngularFire used to provide.
//
// `Auth` and `Functions` are TypeScript interfaces in the modular SDK - unlike `Firestore` they are
// not classes and therefore cannot be used as DI tokens. For consistency all four services are
// exposed through explicit InjectionTokens.

export const FIREBASE_APP = new InjectionToken<FirebaseApp>('firebase.app');
export const AUTH = new InjectionToken<Auth>('firebase.auth');
export const FIRESTORE = new InjectionToken<Firestore>('firebase.firestore');
export const FUNCTIONS = new InjectionToken<Functions>('firebase.functions');

// Both lazy feature areas provide Firebase independently, and `PreloadAllModules` can load them in
// the same session. The SDK factories are memoised so that the emulator hookups - which throw when
// applied twice or after a service has already been used - only ever run once per page load.
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let firestore: Firestore | undefined;
let functions: Functions | undefined;

export function firebaseApp(): FirebaseApp {
  if (!app) {
    app = getApps().length ? getApp() : initializeApp(environment.firebase);
  }
  return app;
}

export function firebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(firebaseApp());
    if (environment.useEmulators) {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    }
  }
  return auth;
}

export function firebaseFirestore(): Firestore {
  if (!firestore) {
    firestore = getFirestore(firebaseApp());
    if (environment.useEmulators) {
      connectFirestoreEmulator(firestore, 'localhost', 8080);
    }
  }
  return firestore;
}

export function firebaseFunctions(): Functions {
  if (!functions) {
    functions = getFunctions(firebaseApp());
    if (environment.useEmulators) {
      connectFunctionsEmulator(functions, 'localhost', 5001);
    }
  }
  return functions;
}

export function provideFirebase(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: FIREBASE_APP, useFactory: firebaseApp },
    { provide: AUTH, useFactory: firebaseAuth },
    { provide: FIRESTORE, useFactory: firebaseFirestore },
    { provide: FUNCTIONS, useFactory: firebaseFunctions }
  ]);
}
