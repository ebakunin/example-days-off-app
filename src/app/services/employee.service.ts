import { Injectable } from '@angular/core';

import { BaseService } from '@services/base.service';
import { Employee } from '@models/employee.model';
import { ExampleEmployee } from '@days-off/data/mock.data';

@Injectable()
export class EmployeeService {
  readonly employees = new BaseService<Employee>();

  constructor() {
    this.employees.setData([ExampleEmployee]);
  }
}
