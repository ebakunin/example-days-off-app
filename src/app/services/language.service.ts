import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import {
    delay,
    distinctUntilKeyChanged,
    filter,
    map,
    pluck, startWith,
    switchMap,
    take,
    tap
} from 'rxjs/operators';

import { SpinnerService } from './spinner.service';
import { Language } from '../models/language.model';
import { English, French, Spanish } from '../data/mock.data';

type TranslationType = {[isoCode: string]: [string, string][]};

@Injectable()
export class LanguageService {
    public readonly languages$ = new BehaviorSubject<Language[]>([English, French, Spanish]);
    public readonly selectedLanguage$ = new BehaviorSubject<Language>(English);
    public readonly translations$ = new BehaviorSubject<TranslationType>({});

    private readonly _storage: TranslationType = {};

    constructor(private _http: HttpClient,
                private _spinnerService: SpinnerService) {
        /* Load initial language */
        this._retrieveTranslations$('en-US').pipe(take(1)).subscribe();
    }

    /**
     * @param {string} isoCode
     * @returns {Observable<Language["isoCode"]>}
     * @private
     */
    private _retrieveTranslations$(isoCode = 'en-US'): Observable<Language['isoCode']> {
        isoCode = isoCode.toLowerCase();

        /* Only retrieve data if it has not yet been loaded */
        if (!this._storage.hasOwnProperty(isoCode)) {
            const path = 'json/' + `translations.${isoCode}.json`;
            const headers = new HttpHeaders().set('Content-Type', 'text/json');

            return this._http.get<[string, string]>(path, {headers}).pipe(
                delay(1000), // fake loading time
                map(json => {
                    this._storage[isoCode] = Object.entries(json);
                    this.translations$.next(this._storage);
                    return isoCode;
                })
            );
        } else {
            return of(isoCode);
        }
    }

    /**
     * @param {string[]} ids
     * @return {Observable<string[]>}
     */
    public translate$(ids: string[]): Observable<string[]> {
        const translations$ = ids.map(id => this._translateById$(id));
        return combineLatest(translations$);
    }

    /**
     * Translates a term using the term's ID.
     * If no translation is available returns the original code.
     * @param {string} id The ID of the desired term to translate
     * @returns {Observable<string>}
     */
    private _translateById$(id: string): Observable<string> {
        return this.selectedLanguage$.pipe(
            distinctUntilKeyChanged('id'),
            tap(() => this._spinnerService.start()),
            switchMap(language => this._retrieveTranslations$(language.isoCode)),
            switchMap(isoCode => this.translations$.pipe(pluck(isoCode.toLowerCase()))),
            filter(translations => translations?.length > 0),
            map(translations => {
                for (const [key, term] of translations) {
                    if (key === id) {
                        return term;
                    }
                }
                return id;
            }),
            tap(() => this._spinnerService.stop())
        );
    }
}
