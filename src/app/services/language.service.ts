import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import {
    distinctUntilKeyChanged,
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

type TranslationType = {[isoCode: string]: Map<string, string>};

@Injectable()
export class LanguageService {
    public readonly languages$ = new BehaviorSubject<Language[]>([English, French, Spanish]);
    public readonly selectedLanguage$ = new BehaviorSubject<Language>(English);

    private readonly _translations$ = new BehaviorSubject<TranslationType>({});
    private readonly _storage: TranslationType = {};

    constructor(private _http: HttpClient,
                private _spinnerService: SpinnerService) {
        /* Load initial language */
        this._retrieveTranslations$('en-US').pipe(take(1)).subscribe();
    }

    /**
     * @param {string[]} tokens
     * @return {Observable<string[]>}
     */
    public translate$(tokens: string[]): Observable<string[]> {
        const translations$ = tokens.map(token => this._translateByToken$(token));
        return combineLatest(translations$).pipe(startWith(['']));
    }

    /**
     * Returns a translated term by token. If no term exists the token is returned instead.
     *
     * @param {string} token
     * @returns {string}
     */
    public getTranslation(token: string): string {
        const isoCode = this.selectedLanguage$.getValue().isoCode.toLowerCase();
        return this._storage[isoCode].get(token) as string ?? token;
    }

    /**
     * @param {string} isoCode
     * @returns {Observable<Language["isoCode"]>}
     * @private
     */
    private _retrieveTranslations$(isoCode: string = 'en-US'): Observable<Language['isoCode']> {
        isoCode = isoCode.toLowerCase();

        /* Only retrieve data if it has not yet been loaded */
        if (!this._storage.hasOwnProperty(isoCode)) {
            const path = 'json/' + `translations.${isoCode}.json`;
            const headers = new HttpHeaders().set('Content-Type', 'text/json');

            return this._http.get<[string, string]>(path, {headers}).pipe(
                // delay(1000), // fake loading time
                map(json => {
                    this._storage[isoCode] = new Map(Object.entries(json));
                    this._translations$.next(this._storage);
                    return isoCode;
                })
            );
        } else {
            return of(isoCode);
        }
    }

    /**
     * Returns a translated term by token. If no term exist the token is returned instead.
     * Displays the spinner during the loading process.
     *
     * @param {string} token The token of the desired term to translate
     * @returns {Observable<string>}
     */
    private _translateByToken$(token: string): Observable<string> {
        return this.selectedLanguage$.pipe(
            distinctUntilKeyChanged('isoCode'),
            tap(() => this._spinnerService.start()),
            switchMap(language => this._retrieveTranslations$(language.isoCode)),
            switchMap(isoCode => this._translations$.pipe(pluck(isoCode.toLowerCase()))),
            map(translations => translations.get(token) ?? token),
            tap(() => this._spinnerService.stop())
        );
    }
}
