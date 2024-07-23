import { NgModule, ModuleWithProviders } from '@angular/core';

import { EmployeeService } from '@services/employee.service';
import { AppService } from '@services/app.service';
import { LanguageService } from '@services/language.service';
import { MessageService } from 'primeng/api';
import { OfficeService } from '@services/office.service';
import { SpinnerService } from '@services/spinner.service';
import { ToastService } from '@services/toast.service';

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
        ToastService,
      ]
    };
  }
}
