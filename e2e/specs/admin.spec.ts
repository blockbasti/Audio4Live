import { Page, expect, test } from '@playwright/test';
import { ADMIN_EMAIL, ADMIN_PASSWORD, createAdminUser, resetEmulators } from '../fixtures/emulator';

async function login(page: Page): Promise<void> {
  await page.goto('/admin/login');
  await page.locator('#loginFormEmail').fill(ADMIN_EMAIL);
  await page.locator('#loginFormPassword').fill(ADMIN_PASSWORD);
  await page.getByRole('button', { name: 'Anmelden' }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

test.describe('admin area', () => {
  test.beforeEach(async () => {
    await resetEmulators();
    await createAdminUser();
  });

  test('redirects anonymous visitors to the login page', async ({ page }) => {
    await page.goto('/admin');

    await expect(page).toHaveURL(/\/admin\/login$/);
    await expect(page.locator('#loginFormEmail')).toBeVisible();
  });

  test('signs in, shows the account email and bounces back off the login page', async ({ page }) => {
    await login(page);

    // Rendering the email proves `authState` emits inside the Angular zone.
    await expect(page.getByText(ADMIN_EMAIL)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Admin' })).toBeVisible();

    await page.goto('/admin/login');
    await expect(page).toHaveURL(/\/admin$/);
  });

  test('adds a blocker and shows it in the list', async ({ page }) => {
    await login(page);

    const start = '01.07.2099';
    const end = '03.07.2099';
    await page.locator('input[matStartDate]').fill(start);
    await page.locator('input[matEndDate]').fill(end);
    await page.locator('input[matEndDate]').blur();

    await page.getByRole('button', { name: 'Hinzufügen' }).click();

    await expect(page.locator('ul.list-group li.list-group-item')).toContainText('2099');
  });

  test('renders the mail tab with the editor and the mjml preview', async ({ page }) => {
    await login(page);

    await page.getByRole('tab', { name: 'Mail' }).click();

    await expect(page.locator('quill-editor .ql-editor')).toBeVisible();
    // The preview iframe is filled from the client-side mjml compilation.
    await expect(page.frameLocator('iframe').locator('body')).toContainText(/\S/);
  });
});
