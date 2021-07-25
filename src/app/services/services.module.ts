import { NgModule, ModuleWithProviders } from '@angular/core';

import { AppService } from './app.service';
import { EmployeeService } from './employee.service';
import { LanguageService } from './language.service';
import { MessageService } from 'primeng/api';
import { OfficeService } from './office.service';
import { SpinnerService } from './spinner.service';
import { ToastService } from './toast.service';

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
