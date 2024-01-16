import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SpinnerService } from '@daysOff/services/spinner.service';

@Component({
    selector: 'app-spinner',
    template: `
        <div id="spinner" *ngIf="showSpinner$ | async">
            <p-progressSpinner strokeWidth="5"></p-progressSpinner>
        </div>
    `,
    styles: [`
        #spinner {
            position: fixed;
            top: calc(50vh - 50px);
            left: calc(50vw - 50px);
            z-index: 200;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerComponent {
    readonly showSpinner$ = this._spinnerService.showSpinner$;

    constructor(private _spinnerService: SpinnerService) {}
}
