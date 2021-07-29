import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    ViewChild
} from '@angular/core';
import { Calendar } from 'primeng/calendar';
import { PrimeNGConfig } from 'primeng/api';
import { Translation } from 'primeng/api/translation';
import { Subject } from 'rxjs';
import { distinctUntilKeyChanged, takeUntil } from 'rxjs/operators';
import {
    addDays,
    addMonths,
    addYears,
    differenceInCalendarMonths,
    endOfDay,
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
    subDays
} from 'date-fns';

import { LanguageService } from '../../services/language.service';
import { Language } from '../../models/language.model';
import { DayNumberType, MonthNumberType } from '../../shared/common.type';

/*
 * Component logic:
 *
 * DaysOffManagementComponent receives a potentially empty array of existing Schedule Exception Dates
 * (for example, a Date object related to a RoomDateException). Those Dates, along with any new Dates or Dates
 * marked for deletion as selected by the user, are placed in 4 "buckets":
 *
 * `existingExceptionsBucket` - currently existing Exceptions
 * `newExceptionsBucket` - new Exceptions to be created
 * `markedForDeletionBucket` - currently existing Exceptions that are to be deleted
 * `_closedDatesBucket` - unavailable dates, usually because the related location is closed
 *
 * The buckets are used to track visual changes on the Calendar and to emit updated data.
 *
 * The `daysOff` @Input is only one-way bound to the Calendar's `ngModel` as the buckets are used to
 * track any changes.
 */

interface IMonthData {
    index: MonthNumberType;
    date: Date;
}

interface ICardData {
    date: Date;
    isPendingDelete: boolean;
}

@Component({
    selector: 'app-days-off-management',
    templateUrl: '../templates/days-off-management.component.html',
    styleUrls: ['../styles/days-off-management.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DaysOffManagementComponent implements AfterViewInit, OnDestroy, OnInit {
    @ViewChild('calendar') calendar!: Calendar;
    @ViewChild('exceptionsListContainer') exceptionsListContainer!: ElementRef;

    /* The focused date when first viewing the Calendar */
    @Input() startingViewDate = startOfToday();
    @Input() closedDays: DayNumberType[] = [];

    private _closedDates: Date[] = [];
    get closedDates() { return this._closedDates; }
    @Input() set closedDates(dates: Date[]) {
        this._closedDates = dates;
        this._closedDates.map(date => date.getTime()).forEach(datetime => {
            this._closedDatesBucket.add(datetime);
        });
    }

    private _daysOff: Date[] = [];
    get daysOff(): Date[] | null {
        /* PrimeNG Calendar throws an error if given an empty array but a null is acceptable */
        return this._daysOff.length > 0 ? this._daysOff as Date[] : null;
    }
    @Input() set daysOff(dates: Date[] | null) {
        if (!Array.isArray(dates)) {
            dates = [];
        }

        if (dates.length > 0) {
            this._daysOff = dates;
            this._daysOff.map(date => date.getTime()).forEach(datetime => {
                this.existingExceptionsBucket.add(datetime);
            });
        }
    }

    @Output() newExceptions = new EventEmitter<Date[]>();
    @Output() exceptionsToBeDeleted = new EventEmitter<Date[]>();
    @Output() currentViewedMonth = new EventEmitter<Date>();

    public readonly todaysDate = startOfToday();
    public readonly todaysMonth = this.todaysDate.getMonth();
    public readonly todaysYear = this.todaysDate.getFullYear();
    public readonly maxDate = endOfDay(subDays(addYears(startOfMonth(this.todaysDate), 2), 1));
    public readonly yearRange = `${this.todaysYear}:${this.todaysYear + 2}`;

    public monthsList: IMonthData[] = [];
    public calendarLocale!: Translation;

    /*
     * Schedule Exception "buckets", where number is a datetime
     */
    public existingExceptionsBucket = new Set<number>();
    public markedForDeletionBucket = new Set<number>();
    public newExceptionsBucket = new Set<number>();
    private _closedDatesBucket = new Set<number>();

    private readonly _destroy$ = new Subject<boolean>();
    private _monthHeaderTracker: number | null = null;

    /*
     * Used to determine when the Calendar should not be updated,
     * usually when scrolling through multiple months at once
     */
    private _disableUpdateCalendarView = false;

    private static _MAX_NEW_EXCEPTION_DATES = 365;

    constructor(private _calendarConfig: PrimeNGConfig,
                private _el: ElementRef,
                private _languagesService: LanguageService,
                private _renderer: Renderer2) {}

    /**
     *
     */
    public ngOnInit(): void {
        if (this.calendarLocale) {
            this._calendarConfig.setTranslation(this.calendarLocale);
        }
    }

    /**
     *
     */
    public ngAfterViewInit(): void {
        this._setSelectedLanguage();
        this._startCalendarListener();

        /* Navigate to specific month on initialization */
        setTimeout(() => {
            if (this.startingViewDate) {
                this.goToMonth(this.startingViewDate);
            } else if (this.calendar.currentYear !== this.todaysYear || this.calendar.currentMonth !== this.todaysMonth) {
                this.goToToday();
            }
        });
    }

    /**
     * Cancel subscriptions.
     */
    public ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.complete();
    }

    /**
     * @returns {ICardData[]}
     */
    get cardData(): ICardData[] {
        return Array.from(this.existingExceptionsBucket)
            .sort((a, b) => a < b ? -1 : 1)
            .map(datetime => {
                return <ICardData> {
                    date: new Date(datetime),
                    isPendingDelete: this.markedForDeletionBucket.has(datetime)
                };
            }
        );
    }

    /**
     * Note: month is 1-based (e.g. August = 8)
     * @param {{month: number, year: number}} e
     */
    public onDateChange(e: {month: number, year: number}): void {
        const viewedMonth = startOfMonth(new Date().setFullYear(e.year, e.month + 1, 1));

        if (!this._disableUpdateCalendarView) {
            this.currentViewedMonth.emit(viewedMonth);
        }

        this._scrollToCardMonthSection();
        this._updateCalendarView();
    }

    /**
     * Select every remaining day in the viewed month.
     */
    public onSelectMonth(): void {
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

        this._selectedDaysInRange(monthStart, monthEnd);
    }

    /**
     * Select every date remaining in the viewed year.
     */
    public onSelectYear(): void {
        const startDate = this.todaysYear === this.calendar.currentYear
            ? startOfDay(this.todaysDate)
            : startOfDay(new Date().setFullYear(this.calendar.currentYear, 0, 1));

        this._selectedDaysInRange(startDate, endOfYear(startDate));
    }

    /**
     * Remove new exception days from the viewed month.
     */
    public onClearMonth(): void {
        const viewedMonth = new Date().setFullYear(this.calendar.currentYear, this.calendar.currentMonth, 1);
        const monthStart = startOfMonth(viewedMonth);
        const monthEnd = endOfMonth(viewedMonth);

        Array.from(this.newExceptionsBucket).forEach(datetime => {
            const date = new Date(datetime);

            if (isBefore(date, monthStart) || isAfter(date, monthEnd)) {
                return;
            } else {
                this.newExceptionsBucket.delete(datetime);
            }
        });

        this._updateCalendarView();
        this._emitExceptionDates();
    }

    /**
     * Remove all newly selected days and update the calendar.
     */
    public onClearAllNewDates(): void {
        this.newExceptionsBucket.clear();

        this._updateCalendarView();
        this._emitExceptionDates();
    }

    /**
     * Mark all existing Schedule Exceptions for deletion and update the calendar.
     */
    public onDeleteAll(): void {
        this.existingExceptionsBucket.forEach(datetime => {
            this.markedForDeletionBucket.add(datetime);
        });

        this._updateCalendarView();
        this._emitExceptionDates();
    }

    /**
     * Mark an existing Schedule Exception for deletion and update the calendar.
     * @param {Date} date
     */
    public onMarkForDelete(date: Date): void {
        this.markedForDeletionBucket.add(date.getTime());

        this._updateCalendarView();
        this._emitExceptionDates();
    }

    /**
     * Unmark an existing Schedule Exception set for deletion and update the calendar.
     * @param {Date} date
     */
    public onRestore(date: Date): void {
        this.markedForDeletionBucket.delete(date.getTime());

        this._updateCalendarView();
        this._emitExceptionDates();
    }

    /**
     * Unmark all existing Schedule Exceptions set for deletion and restore all new Dates to the Calendar.
     */
    public onRestoreAll(): void {
        this.markedForDeletionBucket.clear();

        this._updateCalendarView();
        this._emitExceptionDates();
    }

    /**
     * Scroll to a month on the Calendar.
     * @param {Date} selectedDate
     */
    public goToMonth(selectedDate: Date): void {
        const viewedMonth = startOfMonth(new Date().setFullYear(this.calendar.currentYear, this.calendar.currentMonth, 1));
        const monthDiff = differenceInCalendarMonths(startOfMonth(selectedDate), viewedMonth);

        if (monthDiff !== 0) {
            this._disableUpdateCalendarView = true;

            for (let i = 0; i < Math.abs(monthDiff); i++) {
                if (monthDiff < 0) {
                    this.calendar.navBackward(new Event('click'));
                } else {
                    this.calendar.navForward(new Event('click'));
                }
            }

            this.currentViewedMonth.emit(startOfMonth(selectedDate));

            this._disableUpdateCalendarView = false;
            this._updateCalendarView();
            this._scrollToCardMonthSection();
        }
    }

    /**
     * Scroll to today's month on the Calendar.
     */
    public goToToday(): void {
        this.goToMonth(this.todaysDate);
    }

    /**
     * Determines whether to show the month separator for cards in #exceptionsListContainer.
     * @param {Date} date
     * @param {number} index
     * @returns {boolean}
     */
    public shouldShowCardMonthSeparator(date: Date, index: number): boolean {
        const selectedMonth = date.getMonth();
        const shouldShow = selectedMonth !== this._monthHeaderTracker;
        this._monthHeaderTracker = selectedMonth;
        return index === 0 || shouldShow;
    }

    /**
     * A `trackBy` method
     * @param {number} index
     * @param {ICardData} item
     * @returns {number}
     */
    public trackCardData(index: number, item: ICardData): number {
        return item.date.getTime();
    }

    /**
     * Attach a listener to the Calendar to manage selection changes and emit results.
     * @private
     */
    private _startCalendarListener(): void {
        this._renderer.listen(this.calendar.contentViewChild.nativeElement, 'click', (e: MouseEvent) => {
            const element = e.target as HTMLElement;

            if (element.classList.contains('p-ripple')) {
                const selectedDatetime = startOfDay(new Date().setFullYear(this.calendar.currentYear, this.calendar.currentMonth, parseInt(element.textContent as string, 10))).getTime();

                if (this.existingExceptionsBucket.has(selectedDatetime)) {
                    this._manageExistingException(selectedDatetime);
                } else if (this.newExceptionsBucket.has(selectedDatetime)) {
                    this._removeDates([selectedDatetime]);
                } else {
                    this._addDates([selectedDatetime]);
                }

                this._repaintCalendarMonth([element]);

                this._emitExceptionDates();
            }
        });
    }

    /**
     * Retrieves the selected language to determine the `isoCode` which is needed for datetime translations.
     * @private
     */
    private _setSelectedLanguage(): void {
        this._languagesService.selectedLanguage$.pipe(
            distinctUntilKeyChanged('isoCode'),
            takeUntil(this._destroy$)
        ).subscribe(language => {
            this._setCalendarLocale(language.isoCode);
        });
    }

    /**
     * Populates the `calendarLocale` value for the Calendar, which is needed for datetime translations.
     * @param {Language["isoCode"]} isoCode
     * @private
     */
    private _setCalendarLocale(isoCode: Language['isoCode']): void {
        this.calendarLocale = { dayNames: [], monthNames: [] };

        let startOfTheYear = startOfYear(new Date());
        const endOfTheYear = endOfYear(startOfTheYear);
        while (isBefore(startOfTheYear, endOfTheYear)) {
            this.calendarLocale.monthNames!.push(new Intl.DateTimeFormat(isoCode, {month: 'long'}).format(startOfTheYear));
            startOfTheYear = addMonths(startOfTheYear, 1);
        }

        let startOfTheWeek = startOfWeek(new Date());
        const endOfTheWeek = endOfWeek(startOfTheWeek);
        while (isBefore(startOfTheWeek, endOfTheWeek)) {
            this.calendarLocale.dayNames!.push(new Intl.DateTimeFormat(isoCode, {weekday: 'narrow'}).format(startOfTheWeek));
            startOfTheWeek = addDays(startOfTheWeek, 1);
        }

        this._calendarConfig.setTranslation(this.calendarLocale);

        this._toggleCalendarView();
    }

    /**
     * Emit any Exception Dates that should be created or are marked for deletion.
     * @private
     */
    private _emitExceptionDates(): void {
        this.newExceptions.emit(Array.from(this.newExceptionsBucket).map(datetime => new Date(datetime)));
        this.exceptionsToBeDeleted.emit(Array.from(this.markedForDeletionBucket).map(datetime => new Date(datetime)));
    }

    /**
     * Manage `markedForDeletionBucket` when selecting an existing Schedule Exception on the Calendar.
     * @param {number} clickedDatetime
     * @private
     */
    private _manageExistingException(clickedDatetime: number): void {
        if (this.markedForDeletionBucket.has(clickedDatetime)) {
            this.markedForDeletionBucket.delete(clickedDatetime);
        } else {
            this.markedForDeletionBucket.add(clickedDatetime);
        }
    }

    /**
     * Update `newExceptionsBucket` when adding new days on the Calendar.
     * The user cannot add more than `_MAX_NEW_EXCEPTION_DATES` days at a time.
     * @param {number[]} selectedDateTimes
     * @private
     */
    private _addDates(selectedDateTimes: number[]): void {
        selectedDateTimes.forEach(datetime => {
            if (this.newExceptionsBucket.size < DaysOffManagementComponent._MAX_NEW_EXCEPTION_DATES) {
                this.newExceptionsBucket.add(datetime);
            }
        });
    }

    /**
     * Remove the selected days from `newExceptionsBucket`.
     * @param {number[]} clickedDateTimes
     * @private
     */
    private _removeDates(clickedDateTimes: number[]): void {
        clickedDateTimes.forEach(datetime => {
            this.newExceptionsBucket.delete(datetime);
        });
    }

    /**
     * After switching a Calendar month, scroll to the related month section in #exceptionsListContainer, if it exists.
     * The card month section ID has the format `"#m" + month number + year`, e.g. June 2021 = #m62021.
     */
    private _scrollToCardMonthSection(): void {
        if (this._disableUpdateCalendarView) {
            return;
        }

        const cardMonthSectionId = '#m' + (this.calendar.currentMonth + 1).toString() + this.calendar.currentYear.toString();
        const offsetTop = this.exceptionsListContainer.nativeElement.querySelector(cardMonthSectionId)?.offsetTop;

        if (offsetTop) {
            this.exceptionsListContainer.nativeElement.scrollTo({top: offsetTop - 189, left: 0, behavior: 'smooth'});
        }
    }

    /**
     * By toggling the Calendar month the entire Calendar template is re-rendered.
     * Used when repainting the Calendar month is insufficient.
     * @private
     */
    private _toggleCalendarView(): void {
        setTimeout(() => {
            this._disableUpdateCalendarView = true;
            this.calendar.navBackward(new Event('click'));
            this._disableUpdateCalendarView = false;
            this.calendar.navForward(new Event('click'));
        });
    }


    /**
     * Updates the styling of the Calendar month, marking removed, existing, and new Exception days as appropriate.
     * @param {HTMLElement[]} elements
     * @private
     */
    private _repaintCalendarMonth(elements: HTMLElement[]): void {
        this._shouldDisableCalendarNavigationButton();

        const removedExceptions: string[] = Array.from(this.markedForDeletionBucket).map(datetime => new Date(datetime))
        .filter(date => date.getMonth() === this.calendar.currentMonth && date.getFullYear() === this.calendar.currentYear)
        .map(date => date.getDate().toString());

        const originalExceptions: string[] = this._daysOff
        .filter(date => date.getMonth() === this.calendar.currentMonth && date.getFullYear() === this.calendar.currentYear)
        .map(date => date.getDate().toString());

        const newExceptions: string[] = Array.from(this.newExceptionsBucket).map(datetime => new Date(datetime))
        .filter(date => date.getMonth() === this.calendar.currentMonth && date.getFullYear() === this.calendar.currentYear)
        .map(date => date.getDate().toString());

        elements.forEach(element => {
            const textContent = element.textContent as string;

            if (removedExceptions.includes(textContent)) {
                element.classList.remove('existing-exception-dates');
                element.classList.remove('new-exception-dates');
                element.classList.add('removed-exception-dates');
                element.classList.add('p-highlight');
            } else if (originalExceptions.includes(textContent)) {
                element.classList.add('existing-exception-dates');
                element.classList.remove('new-exception-dates');
                element.classList.remove('removed-exception-dates');
                element.classList.add('p-highlight');
            } else if (newExceptions.includes(textContent)) {
                element.classList.remove('existing-exception-dates');
                element.classList.add('new-exception-dates');
                element.classList.remove('removed-exception-dates');
                element.classList.add('p-highlight');
            } else {
                element.classList.remove('existing-exception-dates');
                element.classList.remove('new-exception-dates');
                element.classList.remove('removed-exception-dates');
                element.classList.remove('p-highlight');
            }
        });
    }

    /**
     * Whether to show or hide the navigation arrows on the Calendar.
     * The user should not see months in the past or advance beyond 3 years in the future.
     * @private
     */
    private _shouldDisableCalendarNavigationButton(): void {
        let disablePreviousButton: boolean;
        let disableNextButton: boolean;

        if (!this.calendar) {
            disablePreviousButton = true;
            disableNextButton = true;
        } else {
            disablePreviousButton = this.calendar.currentYear < this.todaysYear
                ? true
                : this.calendar.currentYear === this.todaysYear && this.calendar.currentMonth <= this.todaysMonth;

            disableNextButton = this.calendar.currentYear === this.todaysYear + 3 && this.calendar.currentMonth === this.todaysMonth - 1;
        }

        setTimeout(() => {
            (this.calendar.contentViewChild.nativeElement.querySelector('button.p-datepicker-prev') as HTMLButtonElement).disabled = disablePreviousButton;
            (this.calendar.contentViewChild.nativeElement.querySelector('button.p-datepicker-next') as HTMLButtonElement).disabled = disableNextButton;
        });
    }

    /**
     * @private
     */
    private _updateCalendarView(): void {
        if (!this.calendar || this._disableUpdateCalendarView) {
            return;
        }

        setTimeout(() => {
            const elements = this.calendar.contentViewChild.nativeElement.querySelectorAll('span.p-ripple') as HTMLElement[];
            this._repaintCalendarMonth(elements);
        });
    }

    /**
     * Add Dates within a range and update the Calendar.
     * @param {Date} startDate
     * @param {Date} endDate
     * @private
     */
    private _selectedDaysInRange(startDate: Date, endDate: Date): void {
        const everyDatetime: number[] = [];

        if (isAfter(endDate, this.maxDate)) {
            endDate = this.maxDate;
        }

        while (isBefore(startDate, endDate)) {
            if (!this.closedDays.includes(startDate.getDay() as DayNumberType) &&
                !this._closedDatesBucket.has(startDate.getTime()) &&
                !this.existingExceptionsBucket.has(startDate.getTime())) {
                everyDatetime.push(startDate.getTime());
            }
            startDate = addDays(startDate, 1);
        }

        this._addDates(everyDatetime);

        this._updateCalendarView();
        this._emitExceptionDates();
    }
}
