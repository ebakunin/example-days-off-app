import {NgModule, ModuleWithProviders} from '@angular/core';
import {MessageService} from 'primeng/api';

import {AppService} from '@daysOff/services/app.service';
import {EmployeeService} from '@daysOff/services/employee.service';
import {LanguageService} from '@daysOff/services/language.service';
import {OfficeService} from '@daysOff/services/office.service';
import {SpinnerService} from '@daysOff/services/spinner.service';
import {ToastService} from '@daysOff/services/toast.service';

@NgModule()
export class ServicesModule {
    static forRoot(): ModuleWithProviders<ServicesModule> {
        return {
            ngModule: ServicesModule,
            providers: [
                AppService,
                EmployeeService,
                LanguageService,
                MessageService,
                OfficeService,
                SpinnerService,
                ToastService
            ]
        };
    }
}
