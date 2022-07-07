import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import { environment } from '../../environments/environment';

export class CustomMissingTranslationHandler implements MissingTranslationHandler {
    handle(params: MissingTranslationHandlerParams) {
        if (environment.debug.translate) {
            console.warn(`Missing translation: ${params.key}`);
        }

        if (params.interpolateParams?.hasOwnProperty('default')) {
            return (params.interpolateParams as any).default ?? '';
        } else {
            return params.key;
        }
    }
}
