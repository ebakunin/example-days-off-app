import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnInit,
    QueryList,
    Renderer2,
    ViewChildren
} from '@angular/core';
import { Subject } from 'rxjs';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';

import { AppService } from '../services/app.service';

@Component({
    selector: 'app-explanations',
    templateUrl: './explanations.component.html',
    styleUrls: ['./explanations.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExplanationsComponent implements OnInit {
    @ViewChildren('showSteps') showSteps!: QueryList<ElementRef>;

    private readonly _destroy$ = new Subject<boolean>();

    constructor(private _appService: AppService, private _renderer: Renderer2) {}

    /**
     *
     */
    public ngOnInit(): void {
        setTimeout(() => {
            this._appService.showExplanation$.next(true); // @fixme
        }, 1000);

        this._appService.showExplanation$.pipe(
            distinctUntilChanged(),
            filter(Boolean),
            takeUntil(this._destroy$)
        ).subscribe(() => this._renderer.setStyle(this.showSteps.get(0)?.nativeElement, 'display', 'block'));
    }


    /**
     * @param {number} step
     */
    public showNextExplanationText(step: number): void {
        this.showSteps.forEach(el => {
            this._renderer.setStyle(el.nativeElement, 'display', 'none');
        });

        this._renderer.setStyle(this.showSteps.get(step)?.nativeElement, 'display', 'block');
    }

    /**
     *
     */
    public onClose(): void {
        this._renderer.setStyle(this.showSteps.get(this.showSteps.length - 1)?.nativeElement, 'display', 'none');
        this._appService.showExplanation$.next(false);
    }
}
