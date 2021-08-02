import { BehaviorSubject } from 'rxjs';
import { Language } from '../models/language.model';
import { English } from '../data/mock.data';

export class MockLanguageService {
    public getTranslation(token: string): string {
        return token;
    }
    public translate$(tokens: string[]): BehaviorSubject<string[]> {
        return new BehaviorSubject<string[]>(tokens);
    }
    public selectedLanguage$ = new BehaviorSubject<Language>(English);
}

export class MockToastService {
    public successToast(summary: string): void {}
    public errorToast(summary: string): void {}
}
