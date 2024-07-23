import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { merge, of } from 'rxjs';
import { delay, first, switchMap, take, tap } from 'rxjs/operators';

import { AppService } from '@services/app.service';
import { EmployeeService } from '@services/employee.service';
import { OfficeService } from '@services/office.service';
import { SpinnerService } from '@services/spinner.service';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly #appService = inject(AppService);
  readonly #employeeService = inject(EmployeeService);
  readonly #officeService = inject(OfficeService);
  readonly #spinnerService = inject(SpinnerService);
  readonly #toastService = inject(ToastService);
  readonly #translate = inject(TranslateService);

  readonly showMesh$ = merge(this.#spinnerService.showSpinner$, this.#appService.showExplanation$);
  readonly employee$ = this.#employeeService.employees.first$;
  readonly office$ = this.#officeService.offices.first$;

  newExceptionDates: Date[] = [];
  exceptionDatesToBeDeleted: Date[] = [];
  startingViewDate!: Date;
  currentViewedMonth!: Date;
  dataIsReady = true;

  onSave(): void {
    if (this.newExceptionDates.length === 0 && this.exceptionDatesToBeDeleted.length === 0) {
      return;
    }

    this.#spinnerService.start();
    this.dataIsReady = false;

    this.employee$.pipe(
      first(),
      switchMap((employee) => {
        employee.daysOff = employee.daysOff.map((day) =>
          this.exceptionDatesToBeDeleted.map((date) => date.getTime()).includes(day.getTime()) ? null : day
        ).filter(Boolean) as Date[];
        return this.#employeeService.employees.saveItem$(employee);
      }),
      switchMap((employee) => {
        if (employee) {
          employee.daysOff = employee.daysOff.concat(this.newExceptionDates);
          return this.#employeeService.employees.saveItem$(employee);
        }
        return of(null);
      }),
      delay(1000), // fake time communicating with the API
      take(1),
      tap(() => {
        this.dataIsReady = true;
        this.#spinnerService.stop();
      })
    ).subscribe({
      next: (success) => {
        if (success) {
          this.startingViewDate = this.currentViewedMonth;
          this.newExceptionDates = [];
          this.exceptionDatesToBeDeleted = [];
          this.#toastService.successToast(this.#translate.instant('DAYS_OFF.MAIN.UPDATE_SUCCESS'));
        } else {
          this.#toastService.errorToast(this.#translate.instant('DAYS_OFF.MAIN.ERROR_SUCCESS'));
        }
      },
      error: () => {
        this.#toastService.errorToast(this.#translate.instant('DAYS_OFF.MAIN.ERROR_SUCCESS'));
      }
    });
  }
}
