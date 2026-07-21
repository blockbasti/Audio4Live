import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Replacement for the `MaxSizeValidator` previously provided by
 * `@angular-material-components/file-input` (removed - unmaintained, only supports Angular ^16).
 * Validates that all files held by the control do not exceed `maxSizeBytes`.
 */
export function maxSizeValidator(maxSizeBytes: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: File | File[] | null = control.value;
    if (!value) {
      return null;
    }
    const files = Array.isArray(value) ? value : [value];
    const oversized = files.some((file) => file && file.size > maxSizeBytes);
    return oversized ? { maxSize: true } : null;
  };
}
