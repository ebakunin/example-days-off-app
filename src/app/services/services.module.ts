import { NgModule, ModuleWithProviders } from '@angular/core';

import { EmployeeService } from './employee.service';
import { LanguageService } from './language.service';
import { OfficeService } from './office.service';
import { SpinnerService } from './spinner.service';

@NgModule()
export class ServicesModule {
    static forRoot(): ModuleWithProviders<ServicesModule> {
        return {
            ngModule: ServicesModule,
            providers: [
                EmployeeService,
                LanguageService,
                OfficeService,
                SpinnerService
            ]
        };
    }
}
