import { ChangeDetectionStrategy, Component } from '@angular/core';
import { merge } from 'rxjs';
import { startOfToday } from 'date-fns';

import { AppService } from './services/app.service';
import { EmployeeService } from './services/employee.service';
import { OfficeService } from './services/office.service';
import { SpinnerService } from './services/spinner.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    public readonly showMesh$ = merge(this._spinnerService.showSpinner$, this._appService.showExplanation$);
    public readonly employee$ = this._employeeService.employees.first$;
    public readonly office$ = this._officeService.offices.first$;

    public newExceptionDates: Date[] = [];
    public exceptionDatesToBeDeleted: Date[] = [];
    public startingViewDate = startOfToday();

    constructor(private _appService: AppService,
                private _employeeService: EmployeeService,
                private _officeService: OfficeService,
                private _spinnerService: SpinnerService) {}

    /**
     *
     */
    public onSave(): void {
        console.log('newExceptionDates', this.newExceptionDates);
        console.log('exceptionDatesToBeDeleted', this.exceptionDatesToBeDeleted);
    }
}
