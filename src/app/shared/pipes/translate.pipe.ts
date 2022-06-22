import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LanguageService } from '../../services/language.service';

@Pipe({name: 'translate'})
export class TranslatePipe implements PipeTransform {
    constructor(private _languagesService: LanguageService) {}

    /**
     * Returns a translated term by token. If no term is available returns the token.
     * @param {string} token
     * @returns {Observable<string>}
     */
    transform(token: string): Observable<string> {
        return this._languagesService.translate$([token]).pipe(map((terms) => terms[0]));
    }
}
