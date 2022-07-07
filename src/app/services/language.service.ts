import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, debounceTime, skip, tap } from 'rxjs';
import { distinctUntilKeyChanged, switchMap } from 'rxjs/operators';

import { SpinnerService } from './spinner.service';
import { Language } from '../models/language.model';
import { AVAILABLE_LANGUAGES, English } from '../data/mock.data';

@Injectable()
export class LanguageService {
    readonly languages$ = new BehaviorSubject<Language[]>(AVAILABLE_LANGUAGES as Language[]);
    readonly selectedLanguage$ = new BehaviorSubject<Language>(English);

    constructor(private _spinnerService: SpinnerService, private _translateService: TranslateService) {
        this.#checkForPreselectedLanguage();
        this.#listenForLanguageChange();
    }

    /**
     * On initialization, switch to pre-selected language if appropriate.
     * @private
     */
    #checkForPreselectedLanguage(): void {
        const preselectedLanguage = AVAILABLE_LANGUAGES.find((lang) =>
            lang.isoCode === localStorage.getItem('currentLanguage')
        );

        if (preselectedLanguage) {
            this.selectedLanguage$.next(preselectedLanguage);
        }
    }

    /**
     * Listen for a language selection change and update translations throughout the app.
     * @private
     */
    #listenForLanguageChange(): void {
        this.selectedLanguage$.pipe(
            skip(1),
            distinctUntilKeyChanged('isoCode'),
            tap((language) => localStorage.setItem('currentLanguage', language.isoCode)),
            tap(() => this._spinnerService.start()),
            switchMap((language) => this._translateService.use(language.isoCode)),
            debounceTime(500),
            tap(() => this._spinnerService.stop())
        ).subscribe();
    }
}
