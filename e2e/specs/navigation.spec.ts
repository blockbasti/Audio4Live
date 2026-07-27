import { expect, test } from '@playwright/test';

/**
 * Route transitions no longer go through `@angular/animations`; the router runs the activation
 * inside `document.startViewTransition()` and `AppComponent` only flips the direction class on
 * <html>. These tests make sure navigation still completes and does not leave the app stuck
 * mid-transition.
 */
test.describe('navigation', () => {
  test('navigates between the top level pages', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#content')).toBeVisible();

    await page.getByRole('link', { name: 'Leistungen' }).click();
    await expect(page).toHaveURL(/\/leistungen$/);
    await expect(page.locator('#content')).toBeVisible();

    await page.getByRole('link', { name: 'Anfragen' }).click();
    await expect(page).toHaveURL(/\/anfragen$/);
    await expect(page.locator('mwl-calendar-month-view')).toBeVisible();
  });

  test('marks backwards navigation so the pages slide the other way', async ({ page }) => {
    await page.goto('/profil');
    await expect(page.locator('#content')).toBeVisible();

    // 'ProfilPage' sits behind 'LandingPage' in the page order, so going home is "back".
    await page.getByRole('link', { name: 'Audio4Live' }).first().click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('html.nav-back')).toHaveCount(1);
  });
});
