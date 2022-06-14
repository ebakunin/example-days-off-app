import { Injectable } from '@angular/core';

import { BaseService } from './base.service';
import { Employee } from '../models/employee.model';
import { ExampleEmployee } from '../data/mock.data';

@Injectable()
export class EmployeeService {
    readonly employees = new BaseService<Employee>();

    constructor() {
        this.employees.setData([ExampleEmployee]);
    }
}
