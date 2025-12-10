import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function forbiddenWordValidator(
  forbiddenWords: string[] = ['bug', 'problema', 'proibida']
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;

    if (!value) return null;

    const normalizedValue = value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    const hasForbidden = forbiddenWords.some((word) => {
      const normalizedWord = word
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

      return normalizedValue.includes(normalizedWord);
    });

    return hasForbidden ? { forbiddenWord: { value: control.value } } : null;
  };
}
