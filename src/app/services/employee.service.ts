import { Injectable } from '@angular/core';

import { BaseService } from '@daysOff/services/base.service';
import { Employee } from '@daysOff/models/employee.model';
import { ExampleEmployee } from '@daysOff/data/mock.data';

@Injectable()
export class EmployeeService {
    readonly employees = new BaseService<Employee>();

    constructor() {
        this.employees.setData([ExampleEmployee]);
    }
}
