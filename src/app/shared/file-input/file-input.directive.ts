import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Replacement for `NgxMatFileInputModule` (from `@angular-material-components/file-input`,
 * removed - unmaintained, only supports Angular ^16). Wraps a native `<input type="file">`
 * as a ControlValueAccessor so it can keep being used with `formControlName`/`ngModel`.
 */
@Directive({
    selector: 'input[type=file][appFileInput]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FileInputDirective),
            multi: true
        }
    ],
    standalone: false
})
export class FileInputDirective implements ControlValueAccessor {
  private onChange: (value: File[] | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('change', ['$event'])
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files && input.files.length ? Array.from(input.files) : null;
    this.onChange(files);
    this.onTouched();
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }

  writeValue(value: File[] | null): void {
    if (!value) {
      this.el.nativeElement.value = '';
    }
  }

  registerOnChange(fn: (value: File[] | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }
}
