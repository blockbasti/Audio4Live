import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  InjectionToken,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// Drop-in replacement for ng-recaptcha that supports any Angular version.
// Loads the Google reCAPTCHA v2 script dynamically and wraps the widget.

export const RECAPTCHA_LANGUAGE = new InjectionToken<string>('recaptcha-language');

declare const grecaptcha: ReCaptchaV2.ReCaptcha;

/** Loads the reCAPTCHA script once per page. */
let scriptPromise: Promise<void> | null = null;

function ensureScript(lang?: string): Promise<void> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve) => {
    if (typeof grecaptcha !== 'undefined') {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src =
      'https://www.google.com/recaptcha/api.js?render=explicit' +
      (lang ? `&hl=${lang}` : '');
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // Poll until grecaptcha is available (browser may delay assignment)
      const poll = setInterval(() => {
        if (typeof grecaptcha !== 'undefined') {
          clearInterval(poll);
          resolve();
        }
      }, 50);
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

@Component({
  selector: 're-captcha',
  template: '<div #captchaEl></div>',
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RecaptchaComponent),
      multi: true,
    },
  ],
})
export class RecaptchaComponent implements AfterViewInit, OnDestroy {
  @Input() siteKey!: string;
  @Input() theme: 'dark' | 'light' = 'light';
  @Output() resolved = new EventEmitter<string | null>();

  @ViewChild('captchaEl') private captchaEl!: ElementRef<HTMLDivElement>;

  private widgetId?: number;
  private onChange: (v: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  private language = inject(RECAPTCHA_LANGUAGE, { optional: true }) ?? undefined;

  ngAfterViewInit(): void {
    ensureScript(this.language).then(() => {
      this.widgetId = grecaptcha.render(this.captchaEl.nativeElement, {
        sitekey: this.siteKey,
        theme: this.theme,
        callback: (token: string) => {
          this.onChange(token);
          this.onTouched();
          this.resolved.emit(token);
        },
        'expired-callback': () => {
          this.onChange(null);
          this.onTouched();
          this.resolved.emit(null);
        },
        'error-callback': () => {
          this.onChange(null);
          this.onTouched();
          this.resolved.emit(null);
        },
      });
    });
  }

  ngOnDestroy(): void {
    if (this.widgetId !== undefined) {
      grecaptcha.reset(this.widgetId);
    }
  }

  // ControlValueAccessor
  writeValue(_: string | null): void {}
  registerOnChange(fn: (v: string | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}
