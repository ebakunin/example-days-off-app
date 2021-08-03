import { ChangeDetectionStrategy, Component } from '@angular/core';
import { merge, of } from 'rxjs';
import { delay, first, switchMap, take, tap } from 'rxjs/operators';

import { AppService } from './services/app.service';
import { EmployeeService } from './services/employee.service';
import { LanguageService } from './services/language.service';
import { OfficeService } from './services/office.service';
import { SpinnerService } from './services/spinner.service';
import { ToastService } from './services/toast.service';

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
    public startingViewDate!: Date;
    public currentViewedMonth!: Date;
    public dataIsReady = true;

    constructor(private _appService: AppService,
                private _employeeService: EmployeeService,
                private _languageService: LanguageService,
                private _officeService: OfficeService,
                private _spinnerService: SpinnerService,
                private _toastService: ToastService) {}

    /**
     *
     */
    public onSave(): void {
        if (this.newExceptionDates.length === 0 && this.exceptionDatesToBeDeleted.length === 0) {
            return;
        }

        this._spinnerService.start();
        this.dataIsReady = false;

        this.employee$.pipe(
            first(),
            switchMap(employee => {
                employee.daysOff = employee.daysOff.map(day => {
                     return this.exceptionDatesToBeDeleted.map(date => date.getTime()).includes(day.getTime()) ? null : day;
                }).filter(Boolean) as Date[];
                return this._employeeService.employees.saveItem$(employee);
            }),
            switchMap(employee => {
                if (employee) {
                    employee.daysOff = employee.daysOff.concat(this.newExceptionDates);
                    return this._employeeService.employees.saveItem$(employee);
                } else {
                    return of(null);
                }
            }),
            delay(1000), // fake time communicating with the API
            take(1),
            tap(() => {
                this.dataIsReady = true;
                this._spinnerService.stop();
            })
        ).subscribe({
            next: success => {
                if (success) {
                    this.startingViewDate = this.currentViewedMonth;
                    this.newExceptionDates = [];
                    this.exceptionDatesToBeDeleted = [];
                    this._toastService.successToast(this._languageService.getTranslation('UI_UPDATE_SUCCESS'));
                } else {
                    this._toastService.errorToast(this._languageService.getTranslation('UI_ERROR_SUCCESS'));
                }
            },
            error: () => {
                this._toastService.errorToast(this._languageService.getTranslation('UI_ERROR_SUCCESS'));
            }
        });
    }
}
