import { ChangeDetectionStrategy, Component, ElementRef, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilKeyChanged, map } from 'rxjs/operators';

import { AppService } from '../services/app.service';
import { LanguageService } from '../services/language.service';
import { Language } from '../models/language.model';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {
    public readonly languages$ = this._languageService.languages$;
    public readonly selectedLanguage$ = this._languageService.selectedLanguage$;
    public readonly showContactDialog$ = this._appService.showContactDialog$;
    public readonly showExplanation$ = this._appService.showExplanation$;
    public showDropdown = false;

    constructor(private _appService: AppService,
                private _elementRef: ElementRef,
                private _languageService: LanguageService) {}

    /**
     * @returns {Observable<string>}
     */
    get globeIcon$(): Observable<string> {
        return this.selectedLanguage$.pipe(distinctUntilKeyChanged('isoCode'), map(language => {
            switch (language.abbreviation) {
                case 'ES':
                case 'FR':
                    return 'fa fa-globe-europe';
                case 'EN':
                default:
                    return 'fa fa-globe-americas';
            }
        }));
    }

    /**
     * @param {Language} language
     */
    public onChangeLanguage(language: Language): void {
        this.selectedLanguage$.next(language)
        this.showDropdown = false;
    }

    /**
     * On off-click hide the language dropdown
     */
    @HostListener('document:click', ['$event'])
    private _onOffClick(e: MouseEvent): void {
        if (!this._elementRef.nativeElement.contains(e.target)) {
            this.showDropdown = false;
        }
    }
}
