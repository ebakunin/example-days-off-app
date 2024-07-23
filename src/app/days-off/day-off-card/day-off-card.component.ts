import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-day-off-card',
  templateUrl: './day-off-card.component.html',
  styleUrls: ['./day-off-card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayOffCardComponent {
  @Input({required: true}) date!: Date;
  @Input() pendingDelete = false
  @Input() showMonthSeparator = false;

  @Output() markForDelete = new EventEmitter<Date>();
  @Output() restore = new EventEmitter<Date>();

  onMarkForDelete(): void {
    this.markForDelete.emit(this.date);
  }

  markForRestore(): void {
    this.restore.emit(this.date);
  }
}

