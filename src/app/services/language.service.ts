import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {PrimeNGConfig} from 'primeng/api';
import {BehaviorSubject, skip, tap} from 'rxjs';
import {delay, distinctUntilKeyChanged, switchMap, take} from 'rxjs/operators';

import {SpinnerService} from '@daysOff/services/spinner.service';
import {Language} from '@daysOff/models/language.model';
import {AVAILABLE_LANGUAGES, English} from '@daysOff/data/mock.data';

@Injectable()
export class LanguageService {
    readonly languages$ = new BehaviorSubject<Language[]>(AVAILABLE_LANGUAGES as Language[]);
    readonly selectedLanguage$ = new BehaviorSubject<Language>(English);

    readonly #delayTime = 500;

    constructor(
        private _config: PrimeNGConfig,
        private _spinnerService: SpinnerService,
        private _translateService: TranslateService
    ) {
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
            this._translateService.get('PRIMENG').pipe(take(1)).subscribe((translations) => {
                this._config.setTranslation(translations);
            });
            this.selectedLanguage$.next(preselectedLanguage);
        }
    }

    /**
     * Listen for a language selection change and update translations throughout the app.
     * This includes any PrimeNG components.
     * @private
     */
    #listenForLanguageChange(): void {
        this.selectedLanguage$.pipe(
            skip(1),
            distinctUntilKeyChanged('isoCode'),
            tap((language) => localStorage.setItem('currentLanguage', language.isoCode)),
            tap(() => this._spinnerService.start()),
            switchMap((language) => this._translateService.use(language.isoCode)),
            switchMap(() => this._translateService.get('PRIMENG')),
            tap((translations) => this._config.setTranslation(translations)),
            delay(this.#delayTime),
            tap(() => {
                // Trigger any PrimeNG calendars to refresh their display
                const calendars: NodeListOf<HTMLElement> = document.querySelectorAll('.p-datepicker-calendar');
                calendars?.forEach((calendar) => calendar.click());
            }),
            tap(() => this._spinnerService.stop())
        ).subscribe();
    }
}
