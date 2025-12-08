import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function forbiddenWordValidator(
  forbiddenWords: string[] = ['bug', 'problema', 'proibida']
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    if (!value) return null;

    const hasForbidden = forbiddenWords.some((word) =>
      value.toLowerCase().includes(word)
    );
    return hasForbidden ? { forbiddenWord: { value: control.value } } : null;
  };
}
