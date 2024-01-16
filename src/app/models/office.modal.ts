import {BaseModel} from '@daysOff/models/base.model';
import {DayNumberType} from '@daysOff/shared/common.types';

export class Office extends BaseModel {
    name = '';
    closedDays: DayNumberType[] = [];
    closedDates: Date[] = [];

    init(modelInfo?: Partial<Office>): void {
        if (modelInfo) {
            this.name = modelInfo.name as string;
            this.closedDays = modelInfo.closedDays as DayNumberType[];
            this.closedDates = modelInfo.closedDates as Date[];
        }
    }
}
