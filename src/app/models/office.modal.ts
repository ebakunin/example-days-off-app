import { BaseModel } from './base.model';
import { DayNumberType } from '../shared/common.types';

export class Office extends BaseModel {
    name = '';
    closedDays: DayNumberType[] = [];
    closedDates: Date[] = [];

    /**
     * @param {Partial<Office>} modelInfo
     */
    init(modelInfo?: Partial<Office>): void {
        if (modelInfo) {
            this.name = modelInfo.name as string;
            this.closedDays = modelInfo.closedDays as DayNumberType[];
            this.closedDates = modelInfo.closedDates as Date[];
        }
    }
}
