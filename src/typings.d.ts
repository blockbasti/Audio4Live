// Ambient typings for the global reCAPTCHA loader callback used by the custom `re-captcha`
// component (see src/app/shared/recaptcha/recaptcha.component.ts).
export {};

declare global {
  interface Window {
    ___grecaptchaOnLoad?: () => void;
  }
}
