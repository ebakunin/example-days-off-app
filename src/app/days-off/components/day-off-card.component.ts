import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

/*
 * Note that the `id` value in the `.month-separator` section must be in English.
 */

@Component({
    selector: 'app-day-off-card',
    template: `
        <div *ngIf="showMonthSeparator"
             class="month-separator"
             [id]="'m' + (date | date:'M') + (date | date:'yyyy')">
            <hr>
            <span>{{ date | localeDate:{month: 'long'} | async }}</span>
        </div>

        <div class="day-off-card"
             [class.pending-delete]="pendingDelete"
             (click)="pendingDelete ? markForRestore() : onMarkForDelete()">
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
    styleUrls: ['../styles/day-off-card.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayOffCardComponent {
    @Input() date!: Date;
    @Input() pendingDelete = false
    @Input() showMonthSeparator = false;

    @Output() markForDelete = new EventEmitter<Date>();
    @Output() restore = new EventEmitter<Date>();

    /**
     *
     */
    public onMarkForDelete(): void {
        this.markForDelete.emit(this.date);
    }

    /**
     *
     */
    public markForRestore(): void {
        this.restore.emit(this.date);
    }
}

