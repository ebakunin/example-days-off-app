import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, tap } from 'rxjs';
import { distinctUntilKeyChanged, switchMap } from 'rxjs/operators';

import { SpinnerService } from './spinner.service';
import { Language } from '../models/language.model';
import { AVAILABLE_LANGUAGES, English } from '../data/mock.data';

@Injectable()
export class LanguageService {
    readonly languages$ = new BehaviorSubject<Language[]>(AVAILABLE_LANGUAGES as Language[]);
    readonly selectedLanguage$ = new BehaviorSubject<Language>(English);

    constructor(private _http: HttpClient,
                private _spinnerService: SpinnerService,
                private _translateService: TranslateService) {
        this.#listenForLanguageChange();
    }

    /**
     * On initialization, switch to pre-selected language if appropriate.
     * Listen for a language selection change and update translations throughout the app.
     * @private
     */
    #listenForLanguageChange(): void {
        const storedIso = localStorage.getItem('currentLanguage');
        if (storedIso) {
            const preselectedLanguage = AVAILABLE_LANGUAGES.find((lang) => lang.isoCode === storedIso);
            this.selectedLanguage$.next(preselectedLanguage as Language);
        }

        this.selectedLanguage$.pipe(
            distinctUntilKeyChanged('isoCode'),
            tap((language) => localStorage.setItem('currentLanguage', language.isoCode)),
            switchMap((language) => this._translateService.use(language.isoCode)),
        ).subscribe();
    }
}
