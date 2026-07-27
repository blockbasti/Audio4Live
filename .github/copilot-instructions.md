# Audio4Live

Angular 21 marketing/booking site for an audio equipment rental business, deployed to Firebase
Hosting with Firebase Cloud Functions (email + booking backend) and Firestore. UI text/content is
German.

## Build, lint, and run

Two independent npm projects: the Angular app at the repo root, and Firebase Functions in
`functions/`. Install and work in each separately (`npm ci` in root, `npm ci` in `functions/`).

Root (Angular app):
- `npm start` — `ng serve -o`, dev server against emulators (see `environment.ts`, `useEmulators: true`)
- `npm run build` — `ng build --configuration production --stats-json`
- `npm run lint` — `ng lint` (angular-eslint flat config in `eslint.config.js`; ESLint 10 no longer supports `.eslintrc`)
- `npm run format` — `prettier . --write` (config in `.prettierrc.json`; runs via lint-staged/husky pre-commit)
- `npm run e2e` — Playwright smoke suite in `e2e/` (`npm run e2e:ui` for the interactive runner)
- There are **no unit test files** in `src/` despite the generated README mentioning `ng test` — don't assume unit test infrastructure exists. The `e2e/` Playwright suite is the only automated test coverage.

Functions (`functions/`):
- `npm run build` — `tsc` compiles `src/` to `lib/`
- `npm run lint` — `eslint ./src/index.ts --fix`
- `npm run serve` / `npm run shell` — Firebase emulators (`firebase emulators:start`)
- `npm run mjml` — regenerates `src/booking.html` from `src/booking.mjml` (email template source of truth is the `.mjml` file, not the `.html`)

CI (`.github/workflows/main.yml`) on every PR: a `build` job (installs both projects, runs `ng build --configuration production`, `ng lint` (non-blocking), functions `npm run build`, functions `npm run lint` (non-blocking)) and an `e2e` job running the Playwright suite. Match these locally before pushing — the production build and the e2e suite are the hard CI gates.

## E2E tests

`npm run e2e` runs the Playwright smoke suite in `e2e/` and is fully self-contained: `playwright.config.ts` boots the Firebase emulators (auth, firestore, functions) and `ng serve` on port 4200 itself, so no manual setup is needed. It covers the things a build cannot prove — the `src/app/firebase/` helpers scheduling change detection so the `OnPush` booking calendar updates from live Firestore snapshots, the `submit`/`verify` callables round-tripping, the functional auth guards redirecting, and the third-party widgets that used to rely on zone.js patching (Quill driving the mjml preview, the `angular-calendar` day click, the mdb modal, route navigation).

Things worth knowing before touching it:
- The suite is serial (`workers: 1`) because the emulators are shared mutable state; `resetEmulators()` in `beforeEach` wipes Firestore and Auth so retries are safe.
- The emulator resolves the `RECAPTCHA_KEY` param only from a dotenv file inside `functions/`, never from the shell environment. `e2e/setup/write-env.mjs` writes a gitignored `functions/.env.local` before startup — without it the functions emulator prompts interactively and registers zero triggers.
- `e2e/fixtures/recaptcha.ts` installs a fake `window.grecaptcha` before app code runs, so `RecaptchaComponent` never fetches Google's script and the real form flow is testable offline.
- The suite needs a JDK on the `PATH` (the Firestore emulator is a Java process) and the Playwright browsers (`npx playwright install chromium`).
- Blocker dates must be aligned to **local** midnight and within the next three months, otherwise the calendar will not mark the cell.
- If a run is interrupted, the Firestore emulator's JVM child process can survive and hold port 8080; kill it before re-running.


Deploys are scheduled/manual GitHub Actions (`deploy.yml` weekly, `deploy_dev.yml` daily to a `dev` hosting channel), not triggered by every push — see those workflows if changing deploy behavior.

## Architecture

- **Routing is fully lazy-loaded** in `app-routing.module.ts`: `/` → `pages.module.ts` (landing, leistungen/services, profil, error), `/anfragen` → `buchen.routes.ts` (booking request form), `/admin` → `admin.routes.ts` (protected by the functional guards in `src/app/firebase/auth.guard.ts`, via `redirectUnauthorizedTo`/`redirectLoggedInTo`). The two Firebase-backed feature areas are standalone components with route-level `providers`; `pages`/`shared` are still NgModules. When adding a new route/section, prefer a lazy `*.routes.ts` with standalone components over a new NgModule.
- **`@angular/fire` is deliberately not used.** Its stable releases peer-depend on `@angular/core@^20`, which blocked all further Angular upgrades, so it was replaced by `src/app/firebase/`: `firebase.providers.ts` (`provideFirebase()` plus the `FIREBASE_APP`/`AUTH`/`FIRESTORE`/`FUNCTIONS` injection tokens and emulator wiring), `collection-data.ts`, `https-callable-data.ts`, `auth-state.ts` and `auth.guard.ts`. Use the plain `firebase` SDK plus these helpers — do not reintroduce `@angular/fire`.
- **Firebase is provided per lazy route**, not globally: `admin.routes.ts` and `buchen.routes.ts` each add `provideFirebase()` to their route `providers`. The underlying SDK instances are memoised module-level singletons, so the emulator hookups (`environment.useEmulators`) only run once per page load.
- **Anything reading Firebase must schedule change detection.** The plain SDK fires callbacks outside of anything Angular observes (AngularFire used to wrap them in `NgZone`), and `BuchenComponent` runs with `OnPush`. The helpers in `src/app/firebase/` handle this via `change-detection.ts`, which captures the surrounding `ChangeDetectorRef` in the injection context and calls `markForCheck()` after every emission; new Firebase subscriptions should reuse those helpers rather than calling `onSnapshot`/`onAuthStateChanged` directly.
- **The app runs zoneless.** `AppModule` provides `provideZonelessChangeDetection()`, `zone.js` is not installed and there is no `polyfills` entry in `angular.json`. Nothing schedules change detection implicitly, so any state change originating outside an Angular template binding must notify Angular itself — see the Firebase helpers above, the `markForCheck()` in `RecaptchaComponent` (grecaptcha callbacks) and in `MailComponent.updatePreview()` (Quill's own DOM listeners). When adding a third-party widget, cover it with an e2e test: a build cannot prove that its updates reach the view.
- **Route animations use the browser's View Transitions API, not `@angular/animations`.** The legacy animation DSL is deprecated, so `app-routing.module.ts` sets `enableViewTransitions: true`, `#content` carries a `view-transition-name` and the slide keyframes live in `src/styles.scss` (they must stay in global styles — view encapsulation cannot reach `::view-transition-*` pseudo-elements). `AppComponent` reads `data.animation` from the recognised route and toggles `.nav-back` on `<html>` to flip the slide direction. `@angular/animations` is still installed only because `mdb-angular-ui-kit` peer-depends on it; do not import it from app code.
- **Bootstrapping uses `platformBrowser()`** from `@angular/platform-browser` (`src/main.ts`); the deprecated `@angular/platform-browser-dynamic` package was removed.
- **Booking flow crosses the frontend/functions boundary**: `src/app/buchen/buchen.component.ts` builds a `Buchung` (see `src/app/buchen/buchung.ts`) and calls the `submit` callable Cloud Function (`functions/src/index.ts`). The function writes to two Firestore collections: `mail` (consumed by the Firestore "Trigger Email" extension, using the `booking` mjml template) and `booking` (the persisted booking record shown in the admin panel). The frontend `Buchung` type is imported directly from `functions/src/index.ts` via a relative path (`../../src/app/buchen/buchung`) — keep this type in sync manually since it's shared, not published as a package.
- **Booking calendar blocking**: `src/app/buchen/blocker.ts` defines `Blocker` (a date `Interval` marking unavailable dates); admin-created blockers and existing bookings are combined in `buchen.component.ts` to disable dates in the `angular-calendar`/datepicker UI.
- **reCAPTCHA verification** goes through the `verify` callable function, which posts to Google's siteverify API using a server-side secret from `functions.config().recaptcha.key` — never move that secret to the frontend.
- **Admin area** (`src/app/admin/`) has three tabs/routes worth of functionality bundled as components rather than separate lazy routes: `booking.component.ts` (view/manage bookings + blockers), `mail.component.ts`/`mail.ts` (compose emails, uses `ngx-quill` rich text editor), `login/`. All gated by the guards configured in `admin.routes.ts`.
- **Emails** are MJML-based: `functions/src/booking.mjml` compiles to `booking.html` (via `npm run mjml`) and `src/assets/message.mjml` is used client-side with `mjml-browser` for admin-composed emails.

## Conventions

- Single quotes, no trailing commas, 140-char print width, imports auto-organized by `prettier-plugin-organize-imports` (see `.prettierrc.json`). Run `npm run format` rather than hand-formatting.
- Angular component/directive selectors are enforced by eslint: components `app-kebab-case`, directives `appCamelCase` (`eslint.config.js`).
- German is used for all user-facing strings (templates, form labels, email content); keep new UI text consistent with this.
- `Buchung` and `Blocker` (in `src/app/buchen/`) are plain data classes with constructor-based default values — follow this style for new shared model types instead of interfaces with separate initialization.
- Functions code (`functions/src/index.ts`) uses the Firebase Functions v1-style API (`functions.https.onCall`, `functions.config()`), not v2 `onCall`/`params` — match the existing style when adding new callables rather than mixing SDK versions.
