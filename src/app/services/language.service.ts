import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { BehaviorSubject, skip, tap } from 'rxjs';
import { delay, distinctUntilKeyChanged, switchMap, take } from 'rxjs/operators';

import { SpinnerService } from '@services/spinner.service';
import { Language } from '@models/language.model';
import { AVAILABLE_LANGUAGES, English } from '@days-off/data/mock.data';

@Injectable()
export class LanguageService {
  readonly #config = inject(PrimeNGConfig);
  readonly #spinnerService = inject(SpinnerService);
  readonly #translateService = inject(TranslateService);

  readonly languages$ = new BehaviorSubject<Language[]>(AVAILABLE_LANGUAGES as Language[]);
  readonly selectedLanguage$ = new BehaviorSubject<Language>(English);

  constructor() {
    this.#checkForPreselectedLanguage();
    this.#listenForLanguageChange();
  }

  /**
   * On initialization, switch to pre-selected language if appropriate.
   */
  #checkForPreselectedLanguage(): void {
    const preselectedLanguage = AVAILABLE_LANGUAGES.find((lang) =>
      lang.isoCode === localStorage.getItem('currentLanguage')
    );

    if (preselectedLanguage) {
      this.#translateService.get('PRIMENG').pipe(take(1)).subscribe((translations) => {
        this.#config.setTranslation(translations);
      });
      this.selectedLanguage$.next(preselectedLanguage);
    }
  }

  /**
   * Listen for a language selection change and update translations throughout the app.
   * This includes any PrimeNG components.
   */
  #listenForLanguageChange(): void {
    this.selectedLanguage$.pipe(
      skip(1),
      distinctUntilKeyChanged('isoCode'),
      tap((language) => localStorage.setItem('currentLanguage', language.isoCode)),
      tap(() => this.#spinnerService.start()),
      switchMap((language) => this.#translateService.use(language.isoCode)),
      switchMap(() => this.#translateService.get('PRIMENG')),
      tap((translations) => this.#config.setTranslation(translations)),
      delay(500),
      tap(() => {
        // Trigger any PrimeNG calendars to refresh their display
        const calendars: NodeListOf<HTMLElement> = document.querySelectorAll('.p-datepicker-calendar');
        calendars?.forEach((calendar) => calendar.click());
      }),
      tap(() => this.#spinnerService.stop())
    ).subscribe();
  }
}
