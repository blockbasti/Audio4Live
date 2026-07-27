import { expect, test } from '@playwright/test';
import { localMidnight, resetEmulators, seedBlocker, waitForDocument } from '../fixtures/emulator';
import { stubRecaptcha } from '../fixtures/recaptcha';

/**
 * The booking page is the only place that combines `OnPush` change detection with live
 * Firestore snapshots and callable functions, so it is where a broken NgZone bridge would
 * show up first.
 */
test.describe('booking page', () => {
  test.beforeEach(async ({ page }) => {
    await resetEmulators();
    await stubRecaptcha(page);
  });

  test('renders Firestore blockers in the calendar', async ({ page }) => {
    // Days 1..3 from today are always inside the visible five-week month view and pass
    // `dateIsValid` (later than now, earlier than now + 3 months).
    await seedBlocker(localMidnight(1), localMidnight(2), false);
    await seedBlocker(localMidnight(3), localMidnight(3), true);

    await page.goto('/anfragen');
    await expect(page.locator('mwl-calendar-month-view')).toBeVisible();

    await expect(page.locator('.cal-day-cell.cal-blocked')).toHaveCount(2);
    await expect(page.locator('.cal-day-cell.cal-single')).toHaveCount(1);
  });

  test('re-renders the calendar when a blocker is added while the page is open', async ({ page }) => {
    await page.goto('/anfragen');
    await expect(page.locator('mwl-calendar-month-view')).toBeVisible();
    await expect(page.locator('.cal-day-cell.cal-blocked')).toHaveCount(0);

    // Written straight to the emulator: only a zone-aware `collectionData` makes the
    // OnPush component pick this up without any user interaction.
    await seedBlocker(localMidnight(1), localMidnight(2), false);

    await expect(page.locator('.cal-day-cell.cal-blocked')).toHaveCount(2);
  });

  test('calls the verify callable when the captcha resolves', async ({ page }) => {
    const verifyRequest = page.waitForRequest((request) => request.url().includes('/us-central1/verify'));

    await page.goto('/anfragen');

    await verifyRequest;
  });

  test('submits a booking through the callable and stores it in Firestore', async ({ page }) => {
    const name = `E2E Tester ${Date.now()}`;

    await page.goto('/anfragen');
    await page.locator('#buchenFormName').fill(name);
    await page.locator('#buchenFormEmail').fill('e2e@audio4live.test');
    await page.locator('#buchenFormMessage').fill('Automatisierter Smoke-Test.');
    await page.locator('#checkAGB').check();

    const submitButton = page.getByRole('button', { name: 'Jetzt anfragen!' });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // The success note only loses `d-none` once the callable has resolved.
    await expect(page.locator('p.note.note-light')).toBeVisible();

    // The function writes both the persisted booking and the "Trigger Email" document.
    await waitForDocument('booking', (document) => JSON.stringify(document).includes(name));
    await waitForDocument('mail', (document) => JSON.stringify(document).includes(name));
  });
});
