import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {merge, of} from 'rxjs';
import {delay, first, switchMap, take, tap} from 'rxjs/operators';

import {AppService} from '@daysOff/services/app.service';
import {EmployeeService} from '@daysOff/services/employee.service';
import {OfficeService} from '@daysOff/services/office.service';
import {SpinnerService} from '@daysOff/services/spinner.service';
import {ToastService} from '@daysOff/services/toast.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    readonly showMesh$ = merge(this._spinnerService.showSpinner$, this._appService.showExplanation$);
    readonly employee$ = this._employeeService.employees.first$;
    readonly office$ = this._officeService.offices.first$;

    readonly TODAY = new Date().getUTCFullYear();

    newExceptionDates: Date[] = [];
    exceptionDatesToBeDeleted: Date[] = [];
    startingViewDate!: Date;
    currentViewedMonth!: Date;
    dataIsReady = true;

    readonly #DELAY_TIME = 0;

    constructor(
        private _appService: AppService,
        private _employeeService: EmployeeService,
        private _officeService: OfficeService,
        private _spinnerService: SpinnerService,
        private _toastService: ToastService,
        private _translate: TranslateService
    ) {}

    onSave(): void {
        if (this.newExceptionDates.length === 0 && this.exceptionDatesToBeDeleted.length === 0) {
            return;
        }

        this._spinnerService.start();
        this.dataIsReady = false;

        this.employee$.pipe(
            first(),
            switchMap((employee) => {
                employee.daysOff = employee.daysOff.map((day) =>
                    this.exceptionDatesToBeDeleted.map((date) => date.getTime()).includes(day.getTime())
                        ? null
                        : day
                ).filter(Boolean) as Date[];
                return this._employeeService.employees.saveItem$(employee);
            }),
            switchMap((employee) => {
                if (employee) {
                    employee.daysOff = employee.daysOff.concat(this.newExceptionDates);
                    return this._employeeService.employees.saveItem$(employee);
                } else {
                    return of(null);
                }
            }),
            delay(this.#DELAY_TIME), // fake time communicating with the API
            take(1),
            tap(() => {
                this.dataIsReady = true;
                this._spinnerService.stop();
            })
        ).subscribe({
            next: (success) => {
                if (success) {
                    this.startingViewDate = this.currentViewedMonth;
                    this.newExceptionDates = [];
                    this.exceptionDatesToBeDeleted = [];
                    this._toastService.successToast(this._translate.instant('DAYS_OFF.MAIN.UPDATE_SUCCESS'));
                } else {
                    this._toastService.errorToast(this._translate.instant('DAYS_OFF.MAIN.ERROR_SUCCESS'));
                }
            },
            error: () => {
                this._toastService.errorToast(this._translate.instant('DAYS_OFF.MAIN.ERROR_SUCCESS'));
            }
        });
    }
}
