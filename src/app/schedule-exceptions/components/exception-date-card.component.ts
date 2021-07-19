import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

/*
 * Note that the `id` value in the `.month-separator` section must be in English.
 */

@Component({
    selector: 'app-exception-date-card',
    template: `
        <div *ngIf="showMonthSeparator"
             class="month-separator"
             [id]="'m' + (date | date:'M') + (date | date:'yyyy')">
            <hr>
            <span>{{ date | localeDate:{month: 'long'} | async }}</span>
        </div>

        <div class="day-off-card"
             [class.pending-delete]="pendingDelete"
             (click)="pendingDelete ? markForRestore() : markForDelete()">
            <div class="cal-day">
                <div class="cal-day-month">{{ date | localeDate:{month: 'short'} | async }}</div>
                <div class="cal-day-date">{{ date | date:'dd' }}</div>
            </div>

            <div class="cal-text">
                <div class="long-date">{{ date | localeDate:'longDate' | async }}</div>
                <div class="full-day">{{ date | localeDate:{weekday: 'long'} | async }}</div>
            </div>

            <div class="delete-day">
                <i *ngIf="!pendingDelete" class="show-delete far fa-times-circle"></i>
                <i *ngIf="pendingDelete" class="show-restore fa fa-undo"></i>
            </div>
        </div> <!-- /.day-off-card -->
    `,
    styleUrls: ['../styles/exception-date-card.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExceptionDateCardComponent {
    @Input() date!: Date;
    @Input() pendingDelete = false
    @Input() showMonthSeparator = false;

    @Output() onMarkForDelete = new EventEmitter<Date>();
    @Output() onRestore = new EventEmitter<Date>();

    /**
     *
     */
    public markForDelete(): void {
        this.onMarkForDelete.emit(this.date);
    }

    /**
     *
     */
    public markForRestore(): void {
        this.onRestore.emit(this.date);
    }
}

