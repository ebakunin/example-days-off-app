import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SpinnerService } from '@services/spinner.service';

@Component({
  selector: 'app-spinner',
  template: `
    @if (showSpinner$ | async) {
      <div id="spinner">
        <p-progressSpinner strokeWidth="5"></p-progressSpinner>
      </div>
    }
  `,
  styles: [`
    #spinner {
      position: fixed;
      top: calc(50vh - 50px);
      left: calc(50vw - 50px);
      z-index: 200;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
  readonly #spinnerService = inject(SpinnerService);
  readonly showSpinner$ = this.#spinnerService.showSpinner$;
}
