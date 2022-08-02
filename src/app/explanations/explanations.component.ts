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
import { delay, distinctUntilChanged, filter, takeUntil, tap } from 'rxjs/operators';

import { AppService } from '../services/app.service';

@Component({
    selector: 'app-explanations',
    templateUrl: './explanations.component.html',
    styleUrls: ['./explanations.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExplanationsComponent implements OnInit {
    @ViewChildren('showSteps') showSteps!: QueryList<ElementRef>;

    readonly #onDestroy$ = new Subject<boolean>();
    #isVisible = false;

    constructor(private _appService: AppService,
                private _elementRef: ElementRef,
                private _renderer: Renderer2) {}

    /**
     *
     */
    ngOnInit(): void {
        this._appService.showExplanation$.pipe(
            distinctUntilChanged(),
            filter(Boolean),
            tap(() => this._renderer.setStyle(this.showSteps.get(0)?.nativeElement, 'display', 'block')),
            delay(100),
            tap(() => this.#isVisible = true),
            takeUntil(this.#onDestroy$)
        ).subscribe();
    }

    /**
     *
     */
    onClose(): void {
        this.showSteps.forEach((el) => this._renderer.setStyle(el.nativeElement, 'display', 'none'));
        this.#isVisible = false;
        this._appService.showExplanation$.next(false);
    }

    /**
     *
     */
    @HostListener('document:keydown.escape')
    onEscape = () => this.onClose();

    /**
     * @param {MouseEvent} e
     */
    @HostListener('document:click', ['$event'])
    onOffClick(e: MouseEvent): void {
        if (this.#isVisible && !this._elementRef.nativeElement.contains(e.target)) {
            this.onClose();
        }
    }

    /**
     * @param {number} step
     */
    showNextExplanationText(step: number): void {
        this.showSteps.forEach((el) => this._renderer.setStyle(el.nativeElement, 'display', 'none'));
        this._renderer.setStyle(this.showSteps.get(step)?.nativeElement, 'display', 'block');
    }
}
