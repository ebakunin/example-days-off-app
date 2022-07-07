import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
    LangChangeEvent,
    MissingTranslationHandler,
    TranslateLoader,
    TranslateModule,
    TranslateService
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CustomMissingTranslationHandler } from './missing-translation.handler';
import { AVAILABLE_LANGUAGES, English } from '../data/mock.data';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                deps: [HttpClient],
                useFactory: HttpLoaderFactory,
            },
            missingTranslationHandler: {
                deps: [],
                provide: MissingTranslationHandler,
                useClass: CustomMissingTranslationHandler,
            },
        }),
    ],
    exports: [TranslateModule],
})
export class TranslateWrapperModule {
    constructor(
        @Optional() @SkipSelf() parentModule: TranslateWrapperModule,
        private _translateService: TranslateService
    ) {
        if (parentModule) {
            throw new Error('TranslateWrapperModule is already loaded.');
        }

        const availableIsoCodes = AVAILABLE_LANGUAGES.map((lang) => lang.isoCode);
        const defaultIsoCode = English.isoCode;

        _translateService.onLangChange.subscribe((e: LangChangeEvent) => {
            const browserLang = _translateService.getBrowserCultureLang();
            const lang = browserLang?.startsWith(e.lang) ? browserLang : e.lang;
            localStorage.setItem('currentLanguage', lang === 'en' ? English.isoCode : lang);
        });

        _translateService.addLangs(availableIsoCodes);
        _translateService.setDefaultLang(defaultIsoCode);
    }

    static forRoot(): ModuleWithProviders<TranslateWrapperModule> {
        return {
            ngModule: TranslateWrapperModule
        };
    }
}
