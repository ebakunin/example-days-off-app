import { Injectable } from '@angular/core';

import { BaseService } from '@daysOff/services/base.service';
import { Office } from '@daysOff/models/office.modal';
import { ExampleOffice } from '@daysOff/data/mock.data';

@Injectable()
export class OfficeService {
    readonly offices = new BaseService<Office>();

    constructor() {
        this.offices.setData([ExampleOffice]);
    }
}
