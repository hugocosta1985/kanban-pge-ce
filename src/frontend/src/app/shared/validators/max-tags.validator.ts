import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function maxTagsValidator(max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const tags = control.value;

    if (Array.isArray(tags) && tags.length > max) {
      return {
        maxTags: {
          requiredLength: max,
          actualLength: tags.length,
        },
      };
    }

    return null;
  };
}
