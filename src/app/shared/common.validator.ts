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
     * @param {AbstractControl} control
     * @returns {{required: boolean} | null}
     */
    static requiredTrimmed = (control: AbstractControl) => {
        return isTrimmedValueEmpty(control.value) ? {'required': true} : null;
    }

    /**
     * Returns whether an array has a minimum number of elements.
     * @param {AbstractControl} control
     * @param {number} minLength
     * @returns {{minimum: boolean} | null}
     */
    static minArrayLength = (control: AbstractControl, minLength: number) => {
        return isMinArrayLength(control.value, minLength) ? {'minimum': true} : null;
    }

    /**
     * Returns whether an array has a maximum number of elements.
     * @param {AbstractControl} control
     * @param {number} maxLength
     * @returns {{maximum: boolean} | null}
     */
    static maxArrayLength = (control: AbstractControl, maxLength: number) => {
        return isMaxArrayLength(control.value, maxLength) ? {'maximum': true} : null;
    }
}

