import {ChangeDetectionStrategy, Component, ElementRef, HostListener, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {distinctUntilKeyChanged, map} from 'rxjs/operators';

import {AppService} from '@daysOff/services/app.service';
import {LanguageService} from '@daysOff/services/language.service';
import {Language} from '@daysOff/models/language.model';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent implements OnInit {
    readonly languages$ = this._languageService.languages$;
    readonly selectedLanguage$ = this._languageService.selectedLanguage$;
    readonly showContactDialog$ = this._appService.showContactDialog$;
    readonly showExplanation$ = this._appService.showExplanation$;

    showDropdown = false;
    inDarkMode = false;

    constructor(
        private _appService: AppService,
        private _elementRef: ElementRef,
        private _languageService: LanguageService
    ) {}

    /**
     *
     */
    ngOnInit(): void {
        if (localStorage.getItem('mode') === 'dark') {
            this.#turnOnDarkMode();
        }
    }

    /**
     *
     */
    get globeIcon$(): Observable<string> {
        return this.selectedLanguage$.pipe(
            distinctUntilKeyChanged('isoCode'),
            map((language) => {
                switch (language.abbreviation.toLowerCase()) {
                    case 'es':
                    case 'fr':
                        return 'fa fa-globe-europe';
                    case 'en':
                    default:
                        return 'fa fa-globe-americas';
                }
            })
        );
    }

    /**
     * On off-click hide the language dropdown
     */
    @HostListener('document:click', ['$event'])
    onOffClick(e: MouseEvent): void {
        if (!this._elementRef.nativeElement.contains(e.target)) {
            this.showDropdown = false;
        }
    }

    /**
     *
     */
    toggleDarkMode(): void {
        if (!this.inDarkMode) {
            this.#turnOnDarkMode();
        } else {
            this.#turnOffDarkMode();
        }
    }

    /**
     *
     */
    onChangeLanguage(language: Language): void {
        this.selectedLanguage$.next(language)
        this.showDropdown = false;
    }

    /**
     * @private
     */
    #turnOffDarkMode(): void {
        document.body.setAttribute('data-theme', '');
        localStorage.setItem('mode', '');
        this.inDarkMode = false;
    }

    /**
     * @private
     */
    #turnOnDarkMode(): void {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('mode', 'dark');
        this.inDarkMode = true;
    }
}
