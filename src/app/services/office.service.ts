import { Injectable } from '@angular/core';

import { BaseService } from './base.service';
import { Office } from '../models/office.modal';
import { ExampleOffice } from '../data/mock.data';

@Injectable()
export class OfficeService {
    public readonly offices = new BaseService<Office>();

    constructor() {
        this.offices.setData([ExampleOffice]);
    }
}
