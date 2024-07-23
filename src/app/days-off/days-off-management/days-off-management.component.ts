import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Calendar, CalendarMonthChangeEvent } from 'primeng/calendar';
import { PrimeNGConfig } from 'primeng/api';
import { Translation } from 'primeng/api/translation';
import { Subject } from 'rxjs';
import { distinctUntilKeyChanged, takeUntil } from 'rxjs/operators';
import {
  addDays,
  addMonths,
  addYears,
  differenceInCalendarMonths,
  endOfMonth,
  endOfWeek,
  endOfYear,
  isAfter,
  isBefore,
  startOfDay,
  startOfMonth,
  startOfToday,
  startOfWeek,
  startOfYear,
} from 'date-fns';

import { LanguageService } from '@services/language.service';
import { Language } from '@models/language.model';

/*
 * Component logic:
 *
 * DaysOffManagementComponent receives a potentially empty array of existing Schedule Exception Dates
 * (for example, a Date object related to a RoomDateException). Those Dates, along with any new Dates or Dates
 * marked for deletion as selected by the user, are placed in 1 of 4 "buckets":
 *
 * `existingExceptionsBucket` - currently existing Exceptions
 * `newExceptionsBucket` - new Exceptions to be created
 * `markedForDeletionBucket` - currently existing Exceptions that are to be deleted
 * `#closedDatesBucket` - unavailable datetimes, usually because the related location is closed
 *
 * The buckets are used to track visual changes on the Calendar and to emit updated data.
 *
 * The `daysOff` @Input is only one-way bound to the Calendar's `ngModel` as the buckets are used to
 * track any changes.
 */

interface ICardData {
  date: Date;
  isPendingDelete: boolean;
}

const MAX_NEW_EXCEPTION_DATES = 365;

@Component({
  selector: 'app-days-off-management',
  templateUrl: './days-off-management.component.html',
  styleUrls: ['./days-off-management.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DaysOffManagementComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('calendar') calendar!: Calendar;
  @ViewChild('exceptionsListContainer') exceptionsListContainer!: ElementRef;

  /* The focused date when first viewing the Calendar */
  @Input() startingViewDate = startOfToday();
  @Input() closedDays: number[] = [];

  #closedDates: Date[] = [];
  get closedDates() {
    return this.#closedDates;
  }

  @Input() set closedDates(dates: Date[]) {
    this.#closedDates = dates
    this.#closedDates.map((date) => date.getTime()).forEach((datetime) => {
      return this.#closedDatesBucket.add(datetime);
    });
  }

  #daysOff: Date[] = [];
  get daysOff(): Date[] | null {
    /* PrimeNG Calendar throws an error if given an empty array but accepts `null` */
    return this.#daysOff.length > 0 ? this.#daysOff : null;
  }

  @Input() set daysOff(dates: Date[] | null) {
    if (Array.isArray(dates) && dates.length > 0) {
      this.#daysOff = dates
      this.#daysOff.map((date) => date.getTime()).forEach((datetime) => {
        return this.existingExceptionsBucket.add(datetime);
      });
    }
  }

  @Output() newExceptions = new EventEmitter<Date[]>();
  @Output() exceptionsToBeDeleted = new EventEmitter<Date[]>();
  @Output() currentViewedMonth = new EventEmitter<Date>();

  readonly todaysDate = startOfToday();
  readonly todaysMonth = this.todaysDate.getMonth();
  readonly todaysYear = this.todaysDate.getFullYear();
  readonly maxDate = endOfMonth(addYears(this.todaysDate, 2));

  calendarLocale!: Translation;

  /*
   * Schedule Exception "buckets", where number is a datetime
   */
  readonly existingExceptionsBucket = new Set<number>();
  readonly markedForDeletionBucket = new Set<number>();
  readonly newExceptionsBucket = new Set<number>();
  readonly #closedDatesBucket = new Set<number>();

  readonly #calendarConfig = inject(PrimeNGConfig);
  readonly #languagesService = inject(LanguageService);
  readonly #renderer = inject(Renderer2);

  readonly #onDestroy$ = new Subject<boolean>();
  #monthHeaderTracker: number | null = null;

  /*
   * Used to determine when the Calendar should not be updated,
   * usually when scrolling through multiple months at once
   */
  #disableUpdateCalendarView = false;

  ngOnInit(): void {
    if (this.calendarLocale) {
      this.#calendarConfig.setTranslation(this.calendarLocale);
    }
  }

  ngAfterViewInit(): void {
    this.#setSelectedLanguage();
    this.#startCalendarListener();

    /* Navigate to specific month on initialization */
    setTimeout(() => {
      if (this.startingViewDate) {
        this.goToMonth(this.startingViewDate);
      } else if (
        this.calendar.currentYear !== this.todaysYear ||
        this.calendar.currentMonth !== this.todaysMonth
      ) {
        this.goToToday();
      }
    });
  }

  ngOnDestroy(): void {
    this.#onDestroy$.next(true);
    this.#onDestroy$.complete();
  }

  get cardData(): ICardData[] {
    return [...this.existingExceptionsBucket]
      .sort((a, b) => a < b ? -1 : 1)
      .map((datetime) => ({
        date: new Date(datetime),
        isPendingDelete: this.markedForDeletionBucket.has(datetime)
      }));
  }

  /**
   * Select every remaining day in the viewed month.
   */
  onSelectMonth(): void {
    let monthStart: Date;
    let monthEnd: Date;

    if (this.calendar.currentYear === this.todaysYear && this.calendar.currentMonth === this.todaysMonth) {
      /* If viewing today's month, do not select dates in the past */
      monthStart = startOfDay(this.todaysDate);
      monthEnd = endOfMonth(monthStart);
    } else {
      const viewedMonth = new Date().setFullYear(this.calendar.currentYear, this.calendar.currentMonth, 1);
      monthStart = startOfMonth(viewedMonth);
      monthEnd = endOfMonth(viewedMonth);
    }

    this.#selectedDaysInRange(monthStart, monthEnd);
  }

  /**
   * Select every date remaining in the viewed year.
   */
  onSelectYear(): void {
    const startDate = this.todaysYear === this.calendar.currentYear
      ? startOfDay(this.todaysDate)
      : startOfDay(new Date().setFullYear(this.calendar.currentYear, 0, 1));

    this.#selectedDaysInRange(startDate, endOfYear(startDate));
  }

  /**
   * Remove new exception days from the viewed month.
   */
  onClearMonth(): void {
    const viewedMonth = new Date().setFullYear(this.calendar.currentYear, this.calendar.currentMonth, 1);
    const monthStart = startOfMonth(viewedMonth);
    const monthEnd = endOfMonth(viewedMonth);

    [...this.newExceptionsBucket].forEach((datetime) => {
      const date = new Date(datetime);

      if (isBefore(date, monthStart) || isAfter(date, monthEnd)) {
        return;
      } else {
        this.newExceptionsBucket.delete(datetime);
      }
    });

    this.#updateCalendarView();
    this.#emitExceptionDates();
  }

  /**
   * Note: month starts at 1 (e.g. August = 8)
   */
  onDateChange(e: CalendarMonthChangeEvent): void {
    if (!this.#disableUpdateCalendarView) {
      const viewedMonth = startOfMonth(
        new Date().setFullYear(e.year as number, e.month as number + 1, 1)
      );
      this.currentViewedMonth.emit(viewedMonth);
    }

    this.#scrollToCardMonthSection();
    this.#updateCalendarView();
  }

  /**
   * Remove all newly selected days and update the calendar.
   */
  onClearAllNewDates(): void {
    this.newExceptionsBucket.clear();

    this.#updateCalendarView();
    this.#emitExceptionDates();
  }

  /**
   * Mark all existing Schedule Exceptions for deletion and update the calendar.
   */
  onDeleteAll(): void {
    this.existingExceptionsBucket.forEach((datetime) => {
      this.markedForDeletionBucket.add(datetime);
    });

    this.#updateCalendarView();
    this.#emitExceptionDates();
  }

  /**
   * Mark an existing Schedule Exception for deletion and update the calendar.
   */
  onMarkForDelete(date: Date): void {
    this.markedForDeletionBucket.add(date.getTime());

    this.#updateCalendarView();
    this.#emitExceptionDates();
  }

  /**
   * Unmark an existing Schedule Exception set for deletion and update the calendar.
   */
  onRestore(date: Date): void {
    this.markedForDeletionBucket.delete(date.getTime());

    this.#updateCalendarView();
    this.#emitExceptionDates();
  }

  /**
   * Unmark all existing Schedule Exceptions set for deletion and restore all new Dates to the Calendar.
   */
  onRestoreAll(): void {
    this.markedForDeletionBucket.clear();

    this.#updateCalendarView();
    this.#emitExceptionDates();
  }

  /**
   * Scroll to a month on the Calendar.
   */
  goToMonth(selectedDate: Date): void {
    const viewedMonth = startOfMonth(
      new Date().setFullYear(this.calendar.currentYear, this.calendar.currentMonth, 1)
    );
    const monthDiff = differenceInCalendarMonths(startOfMonth(selectedDate), viewedMonth);

    if (monthDiff !== 0) {
      this.#disableUpdateCalendarView = true;

      for (let i = 0; i < Math.abs(monthDiff); i++) {
        if (monthDiff < 0) {
          this.calendar.navBackward(new Event('click'));
        } else {
          this.calendar.navForward(new Event('click'));
        }
      }

      this.currentViewedMonth.emit(startOfMonth(selectedDate));

      this.#disableUpdateCalendarView = false;
      this.#updateCalendarView();
      this.#scrollToCardMonthSection();
    }
  }

  /**
   * Scroll to today's month on the Calendar.
   */
  goToToday = () => this.goToMonth(this.todaysDate);

  /**
   * Determines whether to show the month separator for cards in #exceptionsListContainer.
   */
  shouldShowCardMonthSeparator(date: Date, index: number): boolean {
    const selectedMonth = date.getMonth();
    const shouldShow = selectedMonth !== this.#monthHeaderTracker;
    this.#monthHeaderTracker = selectedMonth;
    return index === 0 || shouldShow;
  }

  /**
   * Attach a listener to the Calendar to manage selection changes and emit results.
   */
  #startCalendarListener(): void {
    if (!this.calendar.contentViewChild) {
      return;
    }

    this.#renderer.listen(this.calendar.contentViewChild.nativeElement, 'click', (e: MouseEvent) => {
      const element = e.target as HTMLElement;

      if (element.classList.contains('p-ripple')) {
        const selectedDatetime = startOfDay(new Date().setFullYear(
          this.calendar.currentYear,
          this.calendar.currentMonth,
          parseInt(element.textContent as string, 10)
        )).getTime();

        if (this.existingExceptionsBucket.has(selectedDatetime)) {
          this.#manageExistingException(selectedDatetime);
        } else if (this.newExceptionsBucket.has(selectedDatetime)) {
          this.#removeDates([selectedDatetime]);
        } else {
          this.#addDates([selectedDatetime]);
        }

        this.#repaintCalendarMonth([element]);
        this.#emitExceptionDates();
      }
    });
  }

  /**
   * Retrieves the selected language to determine the `isoCode` which is needed for datetime translations.
   */
  #setSelectedLanguage(): void {
    this.#languagesService.selectedLanguage$.pipe(
      distinctUntilKeyChanged('isoCode'),
      takeUntil(this.#onDestroy$)
    ).subscribe((language) => this.#setCalendarLocale(language.isoCode));
  }

  /**
   * Populates the `calendarLocale` value for the Calendar, which is needed for datetime translations.
   */
  #setCalendarLocale(isoCode: Language['isoCode']): void {
    this.calendarLocale = {dayNames: [], monthNames: []} as Translation;

    let startOfTheYear = startOfYear(new Date());
    const endOfTheYear = endOfYear(startOfTheYear);
    while (isBefore(startOfTheYear, endOfTheYear)) {
      this.calendarLocale.monthNames!.push(
        new Intl.DateTimeFormat(isoCode, {month: 'long'}).format(startOfTheYear)
      );
      startOfTheYear = addMonths(startOfTheYear, 1);
    }

    let startOfTheWeek = startOfWeek(new Date());
    const endOfTheWeek = endOfWeek(startOfTheWeek);
    while (isBefore(startOfTheWeek, endOfTheWeek)) {
      this.calendarLocale.dayNames!.push(
        new Intl.DateTimeFormat(isoCode, {weekday: 'narrow'}).format(startOfTheWeek)
      );
      startOfTheWeek = addDays(startOfTheWeek, 1);
    }

    this.#calendarConfig.setTranslation(this.calendarLocale);

    this.#toggleCalendarView();
  }

  /**
   * Emit any exception Dates that should be created or are marked for deletion.
   */
  #emitExceptionDates(): void {
    const newExceptions = [...this.newExceptionsBucket].map((datetime) => new Date(datetime));
    this.newExceptions.emit(newExceptions);

    const markedExceptions = [...this.markedForDeletionBucket].map((datetime) => new Date(datetime));
    this.exceptionsToBeDeleted.emit(markedExceptions);
  }

  /**
   * Manage `markedForDeletionBucket` when selecting an existing Schedule Exception on the Calendar.
   */
  #manageExistingException(clickedDatetime: number): void {
    if (this.markedForDeletionBucket.has(clickedDatetime)) {
      this.markedForDeletionBucket.delete(clickedDatetime);
    } else {
      this.markedForDeletionBucket.add(clickedDatetime);
    }
  }

  /**
   * Update `newExceptionsBucket` when adding new days on the Calendar.
   * The user cannot add more than `MAX_NEW_EXCEPTION_DATES` days at a time.
   */
  #addDates(selectedDateTimes: number[]): void {
    selectedDateTimes.forEach((datetime) => {
      if (this.newExceptionsBucket.size < MAX_NEW_EXCEPTION_DATES) {
        this.newExceptionsBucket.add(datetime);
      }
    });
  }

  /**
   * Remove the selected days from `newExceptionsBucket`.
   */
  #removeDates(clickedDateTimes: number[]): void {
    clickedDateTimes.forEach((datetime) => this.newExceptionsBucket.delete(datetime));
  }

  /**
   * After switching a Calendar month, scroll to the related month section in #exceptionsListContainer, if it exists.
   * The card month section ID has the format `"#m" + month number + year`, e.g. June 2021 = #m62021.
   */
  #scrollToCardMonthSection(): void {
    if (this.#disableUpdateCalendarView) {
      return;
    }

    const selector = '#m' + (this.calendar.currentMonth + 1).toString() + this.calendar.currentYear.toString();
    const offsetTop = this.exceptionsListContainer.nativeElement.querySelector(selector)?.offsetTop;

    if (offsetTop) {
      this.exceptionsListContainer.nativeElement.scrollTo({top: offsetTop - 189, left: 0, behavior: 'smooth'});
    }
  }

  /**
   * By toggling the Calendar month the entire Calendar template is re-rendered.
   * Used when repainting the Calendar month is insufficient.
   */
  #toggleCalendarView(): void {
    setTimeout(() => {
      this.#disableUpdateCalendarView = true;
      this.calendar.navBackward(new Event('click'));
      this.#disableUpdateCalendarView = false;
      this.calendar.navForward(new Event('click'));
    });
  }


  /**
   * Updates the styling of the Calendar month, marking removed, existing, and new Exception days as appropriate.
   */
  #repaintCalendarMonth(elements: HTMLElement[]): void {
    this.#shouldDisableCalendarNavigationButton();

    const removedExceptions: string[] = [...this.markedForDeletionBucket]
      .map((datetime) => new Date(datetime))
      .filter((date) => (
        date.getMonth() === this.calendar.currentMonth &&
        date.getFullYear() === this.calendar.currentYear)
      )
      .map((date) => date.getDate().toString());

    const originalExceptions: string[] = this.#daysOff
      .filter((date) => (
        date.getMonth() === this.calendar.currentMonth &&
        date.getFullYear() === this.calendar.currentYear)
      )
      .map((date) => date.getDate().toString());

    const newExceptions: string[] = [...this.newExceptionsBucket]
      .map((datetime) => new Date(datetime))
      .filter((date) => (
        date.getMonth() === this.calendar.currentMonth &&
        date.getFullYear() === this.calendar.currentYear)
      )
      .map((date) => date.getDate().toString());

    for (let i = 0; i < elements?.length; i++) {
      const textContent = elements[i].textContent as string;
      const classList = elements[i].classList;

      if (removedExceptions.includes(textContent)) {
        classList.remove('existing-exception-dates');
        classList.remove('new-exception-dates');
        classList.add('removed-exception-dates');
        classList.add('p-highlight');
      } else if (originalExceptions.includes(textContent)) {
        classList.add('existing-exception-dates');
        classList.remove('new-exception-dates');
        classList.remove('removed-exception-dates');
        classList.add('p-highlight');
      } else if (newExceptions.includes(textContent)) {
        classList.remove('existing-exception-dates');
        classList.add('new-exception-dates');
        classList.remove('removed-exception-dates');
        classList.add('p-highlight');
      } else {
        classList.remove('existing-exception-dates');
        classList.remove('new-exception-dates');
        classList.remove('removed-exception-dates');
        classList.remove('p-highlight');
      }
    }
  }

  /**
   * Whether to show or hide the navigation arrows on the Calendar.
   * The user should not see months in the past or advance beyond 3 years in the future.
   */
  #shouldDisableCalendarNavigationButton(): void {
    if (!this.calendar.contentViewChild.nativeElement) {
      return;
    }

    let disablePreviousButton: boolean;
    let disableNextButton: boolean;

    if (!this.calendar) {
      disablePreviousButton = true;
      disableNextButton = true;
    } else {
      disablePreviousButton = this.calendar.currentYear < this.todaysYear
        ? true
        : this.calendar.currentYear === this.todaysYear && this.calendar.currentMonth <= this.todaysMonth;

      disableNextButton = (
        this.calendar.currentYear === this.todaysYear + 2 &&
        this.calendar.currentMonth === this.todaysMonth
      );
    }

    setTimeout(() => {
      const prevSelector = 'button.p-datepicker-prev';
      const nextSelector = 'button.p-datepicker-next';
      this.calendar.contentViewChild.nativeElement.querySelector(prevSelector).disabled = disablePreviousButton;
      this.calendar.contentViewChild.nativeElement.querySelector(nextSelector).disabled = disableNextButton;
    });
  }

  #updateCalendarView(): void {
    if (!this.calendar.contentViewChild || this.#disableUpdateCalendarView) {
      return;
    }

    setTimeout(() => {
      const elements = this.calendar.contentViewChild.nativeElement.querySelectorAll('span.p-ripple');
      this.#repaintCalendarMonth(elements as HTMLElement[]);
    });
  }

  /**
   * Add Dates within a range and update the Calendar.
   */
  #selectedDaysInRange(startDate: Date, endDate: Date): void {
    let everyDatetime: number[] = [];

    if (isAfter(endDate, this.maxDate)) {
      endDate = this.maxDate;
    }

    while (isBefore(startDate, endDate)) {
      const startDatetime = startDate.getTime();
      if (!this.closedDays.includes(startDate.getDay()) &&
        !this.#closedDatesBucket.has(startDatetime) &&
        !this.existingExceptionsBucket.has(startDatetime)) {
        everyDatetime = [...everyDatetime, startDatetime];
      }
      startDate = addDays(startDate, 1);
    }

    this.#addDates(everyDatetime);

    this.#updateCalendarView();
    this.#emitExceptionDates();
  }
}
