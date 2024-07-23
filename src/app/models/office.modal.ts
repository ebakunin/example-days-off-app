import { BaseModel } from '@models/base.model';
import { DayNumberType } from '@days-off/shared/common.types';

export class Office extends BaseModel {
  name = '';
  closedDays: number[] = [];
  closedDates: Date[] = [];

  init(modelInfo?: Partial<Office>): void {
    if (modelInfo) {
      this.name = modelInfo.name as string;
      this.closedDays = modelInfo.closedDays as DayNumberType[];
      this.closedDates = modelInfo.closedDates as Date[];
    }
  }
}
