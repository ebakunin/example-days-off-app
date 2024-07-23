import { AbstractControl } from '@angular/forms';

function isTrimmedValueEmpty(value: string): boolean {
  const test = value?.trim();
  return !test || test.length === 0;
}

function isMinArrayLength(selectedArray: any[], minLength: number): boolean {
  return Array.isArray(selectedArray) && selectedArray.length >= minLength;
}

function isMaxArrayLength(selectedArray: any[], maxLength: number): boolean {
  return Array.isArray(selectedArray) && selectedArray.length <= maxLength;
}

export class CommonValidators {
  /**
   * Mimics `Validators.required` but trims any whitespace first.
   */
  static requiredTrimmed = (control: AbstractControl) => {
    return isTrimmedValueEmpty(control.value) ? {'required': true} : null;
  }

  /**
   * Returns whether an array has a minimum number of elements.
   */
  static minArrayLength = (control: AbstractControl, minLength: number) => {
    return isMinArrayLength(control.value, minLength) ? {'minimum': true} : null;
  }

  /**
   * Returns whether an array has a maximum number of elements.
   */
  static maxArrayLength = (control: AbstractControl, maxLength: number) => {
    return isMaxArrayLength(control.value, maxLength) ? {'maximum': true} : null;
  }
}

