import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    QueryList,
    Renderer2,
    ViewChildren
} from '@angular/core';
import { startOfToday } from 'date-fns';

import { EmployeeService } from './services/employee.service';
import { OfficeService } from './services/office.service';
import { SpinnerService } from './services/spinner.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    @ViewChildren('showSteps') showSteps!: QueryList<ElementRef>;

    public readonly showSpinner$ = this._spinnerService.showSpinner$;
    public readonly employee$ = this._employeeService.employees.first$;
    public readonly office$ = this._officeService.offices.first$;

    public newExceptionDates: Date[] = [];
    public exceptionDatesToBeDeleted: Date[] = [];
    public startingViewDate = startOfToday();
    public showMesh = false;

    constructor(private _employeeService: EmployeeService,
                private _officeService: OfficeService,
                private _renderer: Renderer2,
                private _spinnerService: SpinnerService) {}

    /**
     *
     */
    public onShowExplanationText(): void {
        this.showMesh = true;
        this._renderer.setStyle(this.showSteps.get(0)?.nativeElement, 'display', 'block');
    }

    /**
     * @param {number | "end"} step
     */
    public showNextExplanationText(step: number | 'end'): void {
        this.showSteps.forEach(el => {
            this._renderer.setStyle(el.nativeElement, 'display', 'none');
        });

        if (step !== 'end') {
            this._renderer.setStyle(this.showSteps.get(step)?.nativeElement, 'display', 'block');
        } else {
            this.showMesh = false;
        }
    }

    /**
     *
     */
    public onSave(): void {
        console.log('newExceptionDates', this.newExceptionDates);
        console.log('exceptionDatesToBeDeleted', this.exceptionDatesToBeDeleted);
    }
}
