import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import {
    delay,
    distinctUntilKeyChanged,
    filter,
    map,
    pluck,
    startWith,
    switchMap,
    take,
    tap
} from 'rxjs/operators';

import { SpinnerService } from './spinner.service';
import { Language } from '../models/language.model';
import { English, French, Spanish } from '../data/mock.data';

type TranslationType = Record<Language['isoCode'], Map<string, string>>;

@Injectable()
export class LanguageService {
    readonly languages$ = new BehaviorSubject<Language[]>([English, French, Spanish]);
    readonly selectedLanguage$ = new BehaviorSubject<Language>(English);

    readonly #translations$ = new BehaviorSubject<TranslationType>({});
    readonly #storage: TranslationType = {};
    #loadingLanguage = false;

    constructor(private _http: HttpClient, private _spinnerService: SpinnerService) {
        /* Load initial language */
        this.#retrieveTranslations$('en-US').pipe(take(1)).subscribe();
    }

    /**
     * @param {string[]} tokens
     * @return {Observable<string[]>}
     */
    translate$(tokens: string[]): Observable<string[]> {
        const translations$ = tokens.map((token) => this.#translateByToken$(token));
        return combineLatest(translations$).pipe(startWith(['']));
    }

    /**
     * Returns a translated term by token. If no term exists the token is returned instead.
     *
     * @param {string} token
     * @returns {string}
     */
    getTranslation(token: string): string {
        const isoCode = this.selectedLanguage$.getValue().isoCode.toLowerCase();
        return this.#storage[isoCode].get(token) || token;
    }

    /**
     * @param {string} isoCode
     * @returns {Observable<Language["isoCode"]>}
     * @private
     */
    #retrieveTranslations$(isoCode = 'en-US'): Observable<Language['isoCode']> {
        isoCode = isoCode.toLowerCase();

        /* Only retrieve data if it has not yet been loaded */
        if (!this.#loadingLanguage && !this.#storage.hasOwnProperty(isoCode)) {
            this.#loadingLanguage = true;
            const path = 'translations/' + `translations.${isoCode}.json`;
            const headers = new HttpHeaders().set('Content-Type', 'text/json');

            return this._http.get<[string, string]>(path, {headers}).pipe(
                delay(800), // mock loading time
                map((json) => {
                    this.#storage[isoCode] = new Map(Object.entries(json));
                    this.#translations$.next(this.#storage);
                    this.#loadingLanguage = false;
                    return isoCode;
                })
            );
        } else {
            return of(isoCode);
        }
    }

    /**
     * Returns a translated term by token. If no term exists the token is returned instead.
     * Displays the spinner during the loading process.
     *
     * @param {string} token The token of the desired term to translate
     * @returns {Observable<string>}
     */
    #translateByToken$(token: string): Observable<string> {
        return this.selectedLanguage$.pipe(
            distinctUntilKeyChanged('isoCode'),
            tap(() => this._spinnerService.start()),
            switchMap((language) => this.#retrieveTranslations$(language.isoCode)),
            switchMap((isoCode) => this.#translations$.pipe(pluck(isoCode.toLowerCase()))),
            filter(Boolean),
            map((translations) => {
                const text = translations.get(token) as string;
                return text?.length > 0 ? text : token;
            }),
            tap(() => this._spinnerService.stop())
        );
    }
}
