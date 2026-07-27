import { Page } from '@playwright/test';

/**
 * Installs a fake `grecaptcha` before any app code runs.
 *
 * `RecaptchaComponent.loadRecaptchaScript()` returns early when `window.grecaptcha.render`
 * already exists, so the real Google script is never fetched. The stub resolves immediately,
 * which makes the booking form reach a valid state without any external network dependency.
 */
export async function stubRecaptcha(page: Page): Promise<void> {
  await page.addInitScript(() => {
    let nextWidgetId = 0;
    (window as unknown as { grecaptcha: unknown }).grecaptcha = {
      render(container: HTMLElement, options: { callback?: (response: string) => void }) {
        container.setAttribute('data-e2e-recaptcha', 'stub');
        setTimeout(() => options.callback?.('e2e-recaptcha-token'), 0);
        return nextWidgetId++;
      },
      reset() {},
      getResponse: () => 'e2e-recaptcha-token'
    };
  });
}
