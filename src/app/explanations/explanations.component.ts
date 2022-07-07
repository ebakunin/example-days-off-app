import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
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

    readonly #destroy$ = new Subject<boolean>();

    constructor(private _appService: AppService, private _renderer: Renderer2) {}

    /**
     *
     */
    ngOnInit(): void {
        this._appService.showExplanation$.pipe(
            distinctUntilChanged(),
            filter(Boolean),
            takeUntil(this.#destroy$)
        ).subscribe(() => this._renderer.setStyle(this.showSteps.get(0)?.nativeElement, 'display', 'block'));
    }

    /**
     *
     */
    @HostListener('document:keydown.escape')
    onEscape = () => this.onClose();

    /**
     * @param {number} step
     */
    showNextExplanationText(step: number): void {
        this.showSteps.forEach((el) => this._renderer.setStyle(el.nativeElement, 'display', 'none'));
        this._renderer.setStyle(this.showSteps.get(step)?.nativeElement, 'display', 'block');
    }

    /**
     *
     */
    onClose(): void {
        this.showSteps.forEach((el) => this._renderer.setStyle(el.nativeElement, 'display', 'none'));
        this._appService.showExplanation$.next(false);
    }
}
