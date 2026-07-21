import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, InjectionToken, Input, NgZone, OnDestroy, Optional, Output, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// Minimal replacement for `ng-recaptcha`, which is unmaintained and only supports @angular/core ^17.
// Renders the Google reCAPTCHA v2 widget directly via the public grecaptcha script and exposes the
// same template API (`<re-captcha>`, `(resolved)`, `[(ngModel)]`) that was previously used.

export const RECAPTCHA_LANGUAGE = new InjectionToken<string>('recaptcha-language');

let scriptLoadingPromise: Promise<void> | null = null;

function loadRecaptchaScript(lang?: string): Promise<void> {
  if (grecaptcha?.render) {
    return Promise.resolve();
  }
  if (!scriptLoadingPromise) {
    scriptLoadingPromise = new Promise((resolve) => {
      window.___grecaptchaOnLoad = () => resolve();
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?onload=___grecaptchaOnLoad&render=explicit${lang ? '&hl=' + lang : ''}`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    });
  }
  return scriptLoadingPromise;
}

@Component({
    selector: 'app-re-captcha',
    template: '<div #captchaContainer></div>',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RecaptchaComponent),
            multi: true
        }
    ],
    standalone: false
})
export class RecaptchaComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
  @Input() siteKey: string;
  @Input() theme: 'light' | 'dark' = 'light';
  @Output() resolved = new EventEmitter<string | null>();

  @ViewChild('captchaContainer', { static: true }) container: ElementRef<HTMLDivElement>;

  private widgetId: number | null = null;
  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(
    private zone: NgZone,
    @Optional() @Inject(RECAPTCHA_LANGUAGE) private lang: string | null
  ) {}

  ngAfterViewInit(): void {
    loadRecaptchaScript(this.lang ?? undefined).then(() => this.renderWidget());
  }

  ngOnDestroy(): void {
    if (this.widgetId !== null) {
      grecaptcha?.reset(this.widgetId);
    }
  }

  writeValue(value: string | null): void {
    if (!value && this.widgetId !== null) {
      grecaptcha?.reset(this.widgetId);
    }
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  private renderWidget(): void {
    if (this.widgetId !== null || !this.container || !grecaptcha) {
      return;
    }
    this.widgetId = grecaptcha.render(this.container.nativeElement, {
      sitekey: this.siteKey,
      theme: this.theme,
      callback: (response: string) =>
        this.zone.run(() => {
          this.onChange(response);
          this.onTouched();
          this.resolved.emit(response);
        }),
      'expired-callback': () =>
        this.zone.run(() => {
          this.onChange(null);
          this.resolved.emit(null);
        }),
      'error-callback': () =>
        this.zone.run(() => {
          this.onChange(null);
          this.resolved.emit(null);
        })
    });
  }
}
