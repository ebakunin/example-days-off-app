import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import { Subject } from 'rxjs';
import { delay, distinctUntilChanged, filter, takeUntil, tap } from 'rxjs/operators';

import { AppService } from '@services/app.service';

@Component({
  selector: 'app-explanations',
  templateUrl: './explanations.component.html',
  styleUrls: ['./explanations.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExplanationsComponent implements OnInit {
  @ViewChildren('showSteps') showSteps!: QueryList<ElementRef<HTMLDivElement>>;

  readonly #appService = inject(AppService);
  readonly #elementRef = inject(ElementRef<ExplanationsComponent>);
  readonly #renderer = inject(Renderer2);

  readonly #onDestroy$ = new Subject<boolean>();
  #isVisible = false;

  ngOnInit(): void {
    this.#appService.showExplanation$.pipe(
      distinctUntilChanged(),
      filter(Boolean),
      tap(() => this.#renderer.setStyle(this.showSteps.get(0)?.nativeElement, 'display', 'block')),
      delay(100),
      tap(() => this.#isVisible = true),
      takeUntil(this.#onDestroy$)
    ).subscribe();
  }

  onClose(): void {
    this.showSteps.forEach((el) => this.#renderer.setStyle(el.nativeElement, 'display', 'none'));
    this.#isVisible = false;
    this.#appService.showExplanation$.next(false);
  }

  @HostListener('document:keydown.escape')
  onEscape = () => this.onClose();

  @HostListener('document:click', ['$event'])
  onOffClick(e: MouseEvent): void {
    if (this.#isVisible && !this.#elementRef.nativeElement.contains(e.target)) {
      this.onClose();
    }
  }

  showNextExplanationText(step: number): void {
    this.showSteps.forEach((el) => this.#renderer.setStyle(el.nativeElement, 'display', 'none'));
    this.#renderer.setStyle(this.showSteps.get(step)?.nativeElement, 'display', 'block');
  }
}
