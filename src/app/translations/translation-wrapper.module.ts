import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {
  MissingTranslationHandler,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CustomMissingTranslationHandler } from '@days-off/translations/missing-translation.handler';
import { AVAILABLE_LANGUAGES, English } from '@days-off/data/mock.data';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  exports: [TranslateModule],
  imports: [
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
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
  ]
})
export class TranslateWrapperModule {
  constructor(@Optional() @SkipSelf() parentModule: TranslateWrapperModule, translateService: TranslateService) {
    if (parentModule) {
      throw new Error('TranslateWrapperModule is already loaded.');
    }

    const availableIsoCodes = AVAILABLE_LANGUAGES.map((lang) => lang.isoCode);
    const defaultIsoCode = localStorage.getItem('currentLanguage') ?? English.isoCode;

    translateService.addLangs(availableIsoCodes);
    translateService.setDefaultLang(defaultIsoCode);
  }

  static forRoot(): ModuleWithProviders<TranslateWrapperModule> {
    return {
      ngModule: TranslateWrapperModule
    };
  }
}
