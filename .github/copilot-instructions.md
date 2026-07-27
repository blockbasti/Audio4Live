# Audio4Live

Angular 17 marketing/booking site for an audio equipment rental business, deployed to Firebase
Hosting with Firebase Cloud Functions (email + booking backend) and Firestore. UI text/content is
German.

## Build, lint, and run

Two independent npm projects: the Angular app at the repo root, and Firebase Functions in
`functions/`. Install and work in each separately (`npm ci` in root, `npm ci` in `functions/`).

Root (Angular app):
- `npm start` — `ng serve -o`, dev server against emulators (see `environment.ts`, `useEmulators: true`)
- `npm run build` — `ng build --configuration production --stats-json`
- `npm run lint` — `ng lint` (angular-eslint, config in `.eslintrc.json`)
- `npm run format` — `prettier . --write` (config in `.prettierrc.json`; runs via lint-staged/husky pre-commit)
- There are **no unit test files** in `src/` despite the generated README mentioning `ng test`/`ng e2e` — don't assume test infrastructure exists; verify changes by building/linting instead.

Functions (`functions/`):
- `npm run build` — `tsc` compiles `src/` to `lib/`
- `npm run lint` — `eslint ./src/index.ts --fix`
- `npm run serve` / `npm run shell` — Firebase emulators (`firebase emulators:start`)
- `npm run mjml` — regenerates `src/booking.html` from `src/booking.mjml` (email template source of truth is the `.mjml` file, not the `.html`)

CI (`.github/workflows/main.yml`) on every PR: installs both projects, runs `ng build --configuration production`, `ng lint` (non-blocking), functions `npm run build`, functions `npm run lint` (non-blocking). Match this locally before pushing — a broken production build is the only hard CI gate.

Deploys are scheduled/manual GitHub Actions (`deploy.yml` weekly, `deploy_dev.yml` daily to a `dev` hosting channel), not triggered by every push — see those workflows if changing deploy behavior.

## Architecture

- **Routing is fully lazy-loaded** in `app-routing.module.ts`: `/` → `pages.module.ts` (landing, leistungen/services, profil, error), `/anfragen` → `buchen.routes.ts` (booking request form), `/admin` → `admin.routes.ts` (protected by the functional guards in `src/app/firebase/auth.guard.ts`, via `redirectUnauthorizedTo`/`redirectLoggedInTo`). The two Firebase-backed feature areas are standalone components with route-level `providers`; `pages`/`shared` are still NgModules. When adding a new route/section, prefer a lazy `*.routes.ts` with standalone components over a new NgModule.
- **`@angular/fire` is deliberately not used.** Its stable releases peer-depend on `@angular/core@^20`, which blocked all further Angular upgrades, so it was replaced by `src/app/firebase/`: `firebase.providers.ts` (`provideFirebase()` plus the `FIREBASE_APP`/`AUTH`/`FIRESTORE`/`FUNCTIONS` injection tokens and emulator wiring), `collection-data.ts`, `https-callable-data.ts`, `auth-state.ts` and `auth.guard.ts`. Use the plain `firebase` SDK plus these helpers — do not reintroduce `@angular/fire`.
- **Firebase is provided per lazy route**, not globally: `admin.routes.ts` and `buchen.routes.ts` each add `provideFirebase()` to their route `providers`. The underlying SDK instances are memoised module-level singletons, so the emulator hookups (`environment.useEmulators`) only run once per page load.
- **Anything reading Firebase must re-enter the Angular zone.** The plain SDK fires callbacks outside the zone (AngularFire used to wrap them), and `BuchenComponent` runs with `OnPush`. The helpers in `src/app/firebase/` handle this via `zone.ts`; new Firebase subscriptions should reuse those helpers rather than calling `onSnapshot`/`onAuthStateChanged` directly.
- **Booking flow crosses the frontend/functions boundary**: `src/app/buchen/buchen.component.ts` builds a `Buchung` (see `src/app/buchen/buchung.ts`) and calls the `submit` callable Cloud Function (`functions/src/index.ts`). The function writes to two Firestore collections: `mail` (consumed by the Firestore "Trigger Email" extension, using the `booking` mjml template) and `booking` (the persisted booking record shown in the admin panel). The frontend `Buchung` type is imported directly from `functions/src/index.ts` via a relative path (`../../src/app/buchen/buchung`) — keep this type in sync manually since it's shared, not published as a package.
- **Booking calendar blocking**: `src/app/buchen/blocker.ts` defines `Blocker` (a date `Interval` marking unavailable dates); admin-created blockers and existing bookings are combined in `buchen.component.ts` to disable dates in the `angular-calendar`/datepicker UI.
- **reCAPTCHA verification** goes through the `verify` callable function, which posts to Google's siteverify API using a server-side secret from `functions.config().recaptcha.key` — never move that secret to the frontend.
- **Admin area** (`src/app/admin/`) has three tabs/routes worth of functionality bundled as components rather than separate lazy routes: `booking.component.ts` (view/manage bookings + blockers), `mail.component.ts`/`mail.ts` (compose emails, uses `ngx-quill` rich text editor), `login/`. All gated by the guards configured in `admin.routes.ts`.
- **Emails** are MJML-based: `functions/src/booking.mjml` compiles to `booking.html` (via `npm run mjml`) and `src/assets/message.mjml` is used client-side with `mjml-browser` for admin-composed emails.

## Conventions

- Single quotes, no trailing commas, 140-char print width, imports auto-organized by `prettier-plugin-organize-imports` (see `.prettierrc.json`). Run `npm run format` rather than hand-formatting.
- Angular component/directive selectors are enforced by eslint: components `app-kebab-case`, directives `appCamelCase` (`.eslintrc.json`).
- German is used for all user-facing strings (templates, form labels, email content); keep new UI text consistent with this.
- `Buchung` and `Blocker` (in `src/app/buchen/`) are plain data classes with constructor-based default values — follow this style for new shared model types instead of interfaces with separate initialization.
- Functions code (`functions/src/index.ts`) uses the Firebase Functions v1-style API (`functions.https.onCall`, `functions.config()`), not v2 `onCall`/`params` — match the existing style when adding new callables rather than mixing SDK versions.
