import { BaseModel } from './base.model';

export class Employee extends BaseModel {
    firstName = '';
    middleName = '';
    lastName = '';
    daysOff: Date[] = [];

    /**
     * @param {Partial<Employee>} modelInfo
     */
    init(modelInfo: Partial<Employee>): void {
        if (modelInfo) {
            this.firstName = modelInfo.firstName as string;
            this.middleName = modelInfo.middleName as string;
            this.lastName = modelInfo.lastName as string;
            this.daysOff = modelInfo.daysOff as Date[];
        }
    }
}
