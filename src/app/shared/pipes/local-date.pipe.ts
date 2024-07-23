import { inject, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilKeyChanged, map } from 'rxjs/operators';

import { LanguageService } from '@services/language.service';

type AngularDateTimeFormatOptions =
  'short'
  | 'medium'
  | 'long'
  | 'full'
  | 'shortDate'
  | 'mediumDate'
  | 'longDate'
  | 'fullDate'
  | 'shortTime'
  | 'mediumTime'
  | 'longTime'
  | 'fullTime';

@Pipe({name: 'localeDate'})
export class LocaleDatePipe implements PipeTransform {
  readonly #languagesService = inject(LanguageService);

  readonly #FORMATS: Record<string, Object> = {
    short: {month: 'numeric', day: 'numeric', year: '2-digit', hour: 'numeric', minute: '2-digit'}, // 'M/d/yy, h:mm a'
    medium: {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    }, // 'MMM d, y, h:mm:ss a'
    long: {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    }, // 'MMMM d, y, h:mm:ss a z'
    full: {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'long'
    }, // 'EEEE, MMMM d, y, h:mm:ss a zzzz'
    shortDate: {month: 'numeric', day: 'numeric', year: '2-digit'}, // 'M/d/yy'
    mediumDate: {month: 'short', day: 'numeric', year: 'numeric'}, // 'MMM d, y'
    longDate: {month: 'long', day: 'numeric', year: 'numeric'}, // 'MMMM d, y'
    fullDate: {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'}, // 'EEEE, MMMM d, y'
    shortTime: {hour: 'numeric', minute: '2-digit'}, // 'h:mm a'
    mediumTime: {hour: 'numeric', minute: '2-digit', second: '2-digit'}, // 'h:mm:ss a'
    longTime: {hour: 'numeric', minute: '2-digit', timeZoneName: 'short'}, // 'h:mm:ss a z'
    fullTime: {hour: 'numeric', minute: '2-digit', timeZoneName: 'long'}, // 'h:mm:ss a zzzz'
  };

  /**
   * Asynchronously returns a formatted date according to Intl.DateTimeFormat options.
   * The locale of the format is determined by `LanguagesService.selectedLanguage$`.
   * Optional formatting is identical to Angular DatePipe options.
   *
   * @example
   * // Assume LanguagesService.selectedLanguage$ is currently Spanish
   * In the component:
   *     date = new Date();
   *
   * In the template:
   *    {{ date | localeDate:{month: 'short'} | async }} -> jun.
   *    {{ date | localeDate:'longDate' | async }} -> 14 de junio de 2021
   *
   * @see https://devhints.io/wip/intl-datetime
   */
  transform(date: Date, format: Intl.DateTimeFormatOptions | AngularDateTimeFormatOptions, inMilitaryTime?: boolean): Observable<string> {
    let formatOptions: Intl.DateTimeFormatOptions = {};

    if (typeof format === 'string') {
      if (!this.#FORMATS.hasOwnProperty(format)) {
        console.error('Invalid Angular pre-defined format option');
      } else {
        formatOptions = this.#FORMATS.format;
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

    return this.#languagesService.selectedLanguage$.pipe(
      distinctUntilKeyChanged('isoCode'),
      map((language) => new Intl.DateTimeFormat(language.isoCode, formatOptions).format(date))
    )
  }
}
