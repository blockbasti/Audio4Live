import { defineConfig, devices } from '@playwright/test';

const CI = !!process.env['CI'];

/**
 * Smoke suite for the Firebase-backed parts of the app (booking form + admin area).
 * Runs the real app against the Firebase emulators, so it covers the things a build
 * cannot prove: NgZone re-entry for Firestore snapshots, callable round-trips and
 * the functional auth guards.
 *
 * The emulator needs the `RECAPTCHA_KEY` param, which the Firebase CLI only reads
 * from a dotenv file (not from the shell environment) — `e2e/setup/write-env.mjs`
 * writes a gitignored `functions/.env.local` before the emulators boot.
 */
export default defineConfig({
  testDir: './e2e',
  // The emulators are shared mutable state, so the specs must not race each other.
  fullyParallel: false,
  workers: 1,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: CI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'retain-on-failure',
    video: 'retain-on-failure'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command:
        'node e2e/setup/write-env.mjs && npm --prefix functions run build && npx firebase emulators:start --only auth,firestore,functions --project audio4live-1d621',
      // A GET against the callable answers 400 once the trigger is registered, but 404
      // while the functions emulator is still loading — so this waits for real readiness.
      url: 'http://127.0.0.1:5001/audio4live-1d621/us-central1/verify',
      reuseExistingServer: !CI,
      timeout: 240_000,
      stdout: 'pipe',
      stderr: 'pipe'
    },
    {
      command: 'npx ng serve --port 4200',
      url: 'http://localhost:4200',
      reuseExistingServer: !CI,
      timeout: 240_000,
      stdout: 'pipe',
      stderr: 'pipe'
    }
  ]
});
