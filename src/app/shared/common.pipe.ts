import { Pipe, PipeTransform } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { distinctUntilKeyChanged, map, startWith } from "rxjs/operators";
import 'numeral/locales';

import { LanguageService } from '../services/language.service';
import './common.function'; // @fixme

@Pipe({ name: 'ucfirst' })
export class UcFirstPipe implements PipeTransform {
    /**
     * Equivalent of PHP `ucfirst()`.
     */
    public transform(word: string): string {
        return word.ucfirst();
    }
}

@Pipe({ name: 'ucwords' })
export class UcWordsPipe implements PipeTransform {
    /**
     * Equivalent of PHP `ucwords()`.
     */
    public transform(words: string): string {
        return words.ucwords();
    }
}

@Pipe({ name: 'callFunction' })
export class CallFunctionPipe implements PipeTransform {
    /**
     * Allows use of a Component method in a template without unneeded change detection calls.
     * Does not work with getters, methods without parameters, or methods that reference other
     * properties in the Component.
     *
     * @description
     * {{ firstParam | callFunction: functionName: secondParam }}
     *
     * @example
     * In Component:
     *   public appendRandomNumbers(text: string, moreText: string): string {
     *       return `${text} ${moreText} ` + Math.random();
     *   }
     *
     * In Template:
     *   <li *ngFor="let item of listOfItems">
     *     {{ item.text | callFunction: appendRandomNumbers: item.moreText }}
     *     // If item.text="Example" and item.moreText="foo" then display:
     *     // "Example foo 0.5972487105801683"
     *   </li>
     */
    public transform<T, R>(thisArg: T, project: (t: T, ...others: any[]) => R, ...args: any[]): R {
        return project(thisArg, ...args);
    }
}

@Pipe({ name: 'formGroupType' })
export class FormGroupTypePipe implements PipeTransform {
    /**
     * Types an AbstractControl as a FormGroup.
     *
     * In a template, reactive forms do not retain their typing when using a getter. Instead they default to the
     * "AbstractControl" type. This can cause issues while working with FormGroups that include FormArrays or
     * other inner FormGroups.
     *
     * @example
     * In the component:
     *     this.form = new FormGroup({
     *         name: new FormControl('Alice'),
     *         checkbox: new FormGroup({})
     *     });
     *
     *     this.checkboxData.forEach(checkbox => {
     *         this.form.get('checkbox').addControl(checkbox.display, new FormControl(checkbox.value));
     *     });
     *
     * In the template:
     *   <input type="text" formControlName="name">
     *   <section [formGroup]="form.get('checkbox') | formGroupType">
     */
    public transform(abstractControl: any): FormGroup {
        return abstractControl as FormGroup;
    }
}

@Pipe({ name: 'formControlType' })
export class FormControlTypePipe implements PipeTransform {
    /**
     * Types an AbstractControl as a FormControl.
     *
     * In a template, reactive forms do not retain their typing when using a getter. Instead they default to the
     * "AbstractControl" type. This can cause issues while working with FormGroups that include FormArrays or
     * other inner FormGroups.
     *
     * @example
     * In the component:
     *     this.form = new FormGroup({
     *         name: new FormControl('Alice'),
     *         options: new FormArray([])
     *     });
     *
     * In the template:
     *   <input type="text" formControlName="name">
     *   <section *ngFor="let options of form.get('options').controls">
     *       <input type="checkbox" [formControl]="options | formControlType">
     *   </section>
     */
    public transform(abstractControl: any): FormControl {
        return abstractControl as FormControl;
    }
}

@Pipe({ name: 'formKeys' })
export class FormKeysPipe implements PipeTransform {
    /**
     * Returns the FormControl keys of a FormGroup.
     *
     * @example
     *   <form *ngIf="(form | formKeys).length > 0" [formGroup]="form">
     */
    public transform(form: FormGroup): string[] {
        return Object.keys(form.controls);
    }
}

@Pipe({ name: 'sortByDate' })
export class SortByDatePipe implements PipeTransform {
    /**
     * Sort an Array or Set of Dates, either ascending or descending.
     * If a Set, the result is converted to an Array.
     *
     * @example
     *   <li *ngFor="let date of dateArray | sortByDate">
     *       {{ date | date:'longDate' }}
     *   </li>
     */
    public transform(data: Date[] | Set<Date>, order: 'asc'|'desc' = 'asc'): Date[] {
        if (data instanceof Set) {
            data = Array.from(data);
        }

        return order === 'asc'
            ? data.sort((a, b) => a.getTime() > b.getTime() ? 1 : a.getTime() < b.getTime() ? -1 : 0)
            : data.sort((a, b) => a.getTime() < b.getTime() ? 1 : a.getTime() > b.getTime() ? -1 : 0);
    }
}

@Pipe({ name: 'toDate' })
export class ToDatePipe implements PipeTransform {
    /**
     * Coverts a datetime to a Date object.
     *
     * @example
     * In the component:
     *   public dateTimeInMay = 1622530800000;
     *
     * In the template:
     *   {{ dateTimeInMay | toDate | date:'mediumDate' }}
     *   // Will display: May 1, 2021
     *
     * @param {number} datetime
     */
    public transform(datetime: number): Date {
        return new Date(datetime);
    }
}

type AngularDateFormat = 'short'|'medium'|'long'|'full'|'shortDate'|'mediumDate'|'longDate'|'fullDate'|'shortTime'|'mediumTime'|'longTime'|'fullTime';

@Pipe({ name: 'localeDate' })
export class LocaleDatePipe implements PipeTransform {
    private static Formats: any = {
        short: {month: 'numeric', day: 'numeric', year: '2-digit', hour: 'numeric', minute: '2-digit'}, // 'M/d/yy, h:mm a'
        medium: {month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit'}, // 'MMM d, y, h:mm:ss a'
        long: {month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit', timeZoneName: 'short'}, // 'MMMM d, y, h:mm:ss a z'
        full: {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit', timeZoneName: 'long'}, // 'EEEE, MMMM d, y, h:mm:ss a zzzz'
        shortDate: {month: 'numeric', day: 'numeric', year: '2-digit'}, // 'M/d/yy'
        mediumDate: {month: 'short', day: 'numeric', year: 'numeric'}, // 'MMM d, y'
        longDate: {month: 'long', day: 'numeric', year: 'numeric'}, // 'MMMM d, y'
        fullDate: {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'}, // 'EEEE, MMMM d, y'
        shortTime: {hour: 'numeric', minute: '2-digit'}, // 'h:mm a'
        mediumTime: {hour: 'numeric', minute: '2-digit', second: '2-digit'}, // 'h:mm:ss a'
        longTime: {hour: 'numeric', minute: '2-digit', timeZoneName: 'short'}, // 'h:mm:ss a z'
        fullTime: {hour: 'numeric', minute: '2-digit', timeZoneName: 'long'}, // 'h:mm:ss a zzzz'
    };

    constructor(private _languagesService: LanguageService) {}

    /**
     * Asynchronously returns a formatted date according to Intl.DateTimeFormat options.
     * The locale of the format is determined by `LanguagesService.selectedLanguage$`.
     * Optional formatting is identical to Angular DatePipe options.
     *
     * @example
     * In the component:
     *     public date = new Date();
     *
     * In the template:
     *    {{ date | localeDate:{month: 'short'} }} -> jun.
     *    {{ date | localeDate:'longDate' }} -> 14 de junio de 2021
     *
     * @param {Date} date
     * @param {Object | AngularDateFormat} format - if an Object, it must use Intl.DateTimeFormat options.
     * @param {boolean} inMilitaryTime
     * @returns {string}
     * @see https://devhints.io/wip/intl-datetime
     */
    public transform(date: Date, format: Object | AngularDateFormat, inMilitaryTime?: boolean): Observable<string> {
        let formatOptions: any = {};

        if (typeof format === 'string') {
            if (!LocaleDatePipe.Formats.hasOwnProperty(format)) {
                console.error('Invalid Angular pre-defined format option');
            } else {
                formatOptions = LocaleDatePipe.Formats.format;
            }
        } else {
            formatOptions = format;
        }

        if (typeof inMilitaryTime === 'boolean') {
            formatOptions.hour12 = !inMilitaryTime;
            if (inMilitaryTime && formatOptions?.hour) {
                formatOptions.hour = '2-digit';
            }
        }

        return this._languagesService.selectedLanguage$.pipe(
            distinctUntilKeyChanged('isoCode'),
            map(language => new Intl.DateTimeFormat(language.isoCode, formatOptions).format(date))
        )
    }
}

@Pipe({ name: 'translate' })
export class TranslatePipe implements PipeTransform {
    constructor(private _languagesService: LanguageService) {}

    public transform(code: string): Observable<string> {
        return this._languagesService.translate$([code]).pipe(startWith(''), map(t => t?.[0] ?? ''));
    }
}
