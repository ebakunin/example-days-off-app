import { ChangeDetectionStrategy, Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { distinctUntilKeyChanged, map, takeUntil } from 'rxjs/operators';

import { LanguageService } from '../services/language.service';
import { Language } from '../models/language.model';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
    @Output() showExplanation = new EventEmitter<boolean>()

    public readonly languages$ = this._languageService.languages$;
    public readonly selectedLanguage$ = this._languageService.selectedLanguage$;
    public showDropdown = false;

    public translations = { send: '_' };
    private readonly _destroy$ = new Subject<boolean>();

    constructor(private _languageService: LanguageService) {}

    /**
     *
     */
    public ngOnInit(): void {
        this._languageService.translate$(['Send']).pipe(takeUntil(this._destroy$)).subscribe(([send]) => {
            this.translations.send = send;
        });
    }

    /**
     * @returns {Observable<string>}
     */
    get globeIcon$(): Observable<string> {
        return this.selectedLanguage$.pipe(
            distinctUntilKeyChanged('isoCode'),
            map(language => {
                switch (language.abbreviation) {
                    case 'ES':
                    case 'FR':
                        return 'fa-globe-europe';
                    case 'EN':
                    default:
                        return 'fa-globe-americas';
                }
            })
        );
    }

    /**
     * @param {Language} language
     */
    public onChangeLanguage(language: Language): void {
        this.selectedLanguage$.next(language)
        this.showDropdown = false;
    }

    /**
     * @todo
     */
    public onSendMessage(): void {
        //
    }
}
