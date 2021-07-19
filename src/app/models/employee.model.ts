import { BaseModel } from './base.model';

export class Employee extends BaseModel {
    public firstName = '';
    public middleName = '';
    public lastName = '';
    public daysOff: Date[] = [];

    /**
     * @param {Partial<Employee>} modelInfo
     */
    public init(modelInfo: Partial<Employee>): void {
        if (modelInfo) {
            this.firstName = modelInfo.firstName as string;
            this.middleName = modelInfo.middleName as string;
            this.lastName = modelInfo.lastName as string;
            this.daysOff = modelInfo.daysOff as Date[];
        }
    }
}
