import { BaseModel } from './base.model';
import { DayNumberType } from '../shared/common.type';

export class Office extends BaseModel {
    public name = '';
    public closedDays: DayNumberType[] = [];
    public closedDates: Date[] = [];

    /**
     * @param {Partial<Office>} modelInfo
     */
    public init(modelInfo?: Partial<Office>): void {
        if (modelInfo) {
            this.name = modelInfo.name as string;
            this.closedDays = modelInfo.closedDays as DayNumberType[];
            this.closedDates = modelInfo.closedDates as Date[];
        }
    }
}
