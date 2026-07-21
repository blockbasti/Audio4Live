// Ambient typings for the global reCAPTCHA loader callback used by the custom `re-captcha`
// component (see src/app/shared/recaptcha/recaptcha.component.ts).
export {};

declare global {
  interface Window {
    ___grecaptchaOnLoad?: () => void;
    // @types/grecaptcha only declares a bare global `var grecaptcha`, which is unsafe to
    // reference directly before the script has loaded (throws ReferenceError). Accessing it
    // via `window.grecaptcha` instead safely evaluates to `undefined` until it's defined.
    grecaptcha?: typeof grecaptcha;
  }
}
