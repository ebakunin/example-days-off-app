import { BehaviorSubject } from 'rxjs';
import { Language } from '../models/language.model';
import { English } from '../data/mock.data';

export class MockLanguageService {
    getTranslation = (token: string): string => token;
    translate$ = (tokens: string[]): BehaviorSubject<string[]> => new BehaviorSubject<string[]>(tokens);

    selectedLanguage$ = new BehaviorSubject<Language>(English);
}

export class MockToastService {
    successToast(summary: string): void {}
    errorToast(summary: string): void {}
}
