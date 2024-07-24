import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'ucfirst'})
export class UcFirstPipe implements PipeTransform {
  /**
   * Equivalent of PHP `ucfirst()`.
   */
  transform(word: string): string {
    return word.ucfirst();
  }
}

@Pipe({name: 'ucwords'})
export class UcWordsPipe implements PipeTransform {
  /**
   * Equivalent of PHP `ucwords()`.
   */
  transform(words: string): string {
    return words.ucwords();
  }
}

@Pipe({name: 'callFunction'})
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
   *   appendRandomNumbers(text: string, moreText: string): string {
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
  transform<T, R>(thisArg: T, project: (t: T, ...others: any[]) => R, ...args: any[]): R {
    return project(thisArg, ...args);
  }
}

@Pipe({name: 'sortByDate'})
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
  transform(data: Date[] | Set<Date>, order: 'asc' | 'desc' = 'asc'): Date[] {
    if (data instanceof Set) {
      data = [...data];
    }

    return order === 'asc'
      ? data.sort((a, b) => a.getTime() > b.getTime() ? 1 : a.getTime() < b.getTime() ? -1 : 0)
      : data.sort((a, b) => a.getTime() < b.getTime() ? 1 : a.getTime() > b.getTime() ? -1 : 0);
  }
}

@Pipe({name: 'toDate'})
export class ToDatePipe implements PipeTransform {
  /**
   * Coverts a datetime to a Date object.
   *
   * @example
   * In the component:
   *   dateTimeInMay = 1622530800000;
   *
   * In the template:
   *   {{ dateTimeInMay | toDate | date:'mediumDate' }}
   *   // Will display: May 1, 2021
   */
  transform(datetime: number): Date {
    return new Date(datetime);
  }
}
