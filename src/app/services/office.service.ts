import { Injectable } from '@angular/core';

import { BaseService } from '@services/base.service';
import { Office } from '@models/office.modal';
import { ExampleOffice } from '@days-off/data/mock.data';

@Injectable()
export class OfficeService {
  readonly offices = new BaseService<Office>();

  constructor() {
    this.offices.setData([ExampleOffice]);
  }
}
