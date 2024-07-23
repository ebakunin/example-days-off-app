import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilKeyChanged, map } from 'rxjs/operators';

import { AppService } from '@services/app.service';
import { LanguageService } from '@services/language.service';
import { Language } from '@models/language.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent implements OnInit {
  readonly #appService = inject(AppService);
  readonly #elementRef = inject(ElementRef);
  readonly #languageService = inject(LanguageService);

  readonly languages$ = this.#languageService.languages$;
  readonly selectedLanguage$ = this.#languageService.selectedLanguage$;
  readonly showContactDialog$ = this.#appService.showContactDialog$;
  readonly showExplanation$ = this.#appService.showExplanation$;

  showDropdown = false;
  inDarkMode = false;

  ngOnInit(): void {
    if (localStorage.getItem('mode') === 'dark') {
      this.#turnOnDarkMode();
    }
  }

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
    if (!this.#elementRef.nativeElement.contains(e.target)) {
      this.showDropdown = false;
    }
  }

  toggleDarkMode(): void {
    if (!this.inDarkMode) {
      this.#turnOnDarkMode();
    } else {
      this.#turnOffDarkMode();
    }
  }

  onChangeLanguage(language: Language): void {
    this.selectedLanguage$.next(language)
    this.showDropdown = false;
  }

  #turnOffDarkMode(): void {
    document.body.setAttribute('data-theme', '');
    localStorage.setItem('mode', '');
    this.inDarkMode = false;
  }

  #turnOnDarkMode(): void {
    document.body.setAttribute('data-theme', 'dark');
    localStorage.setItem('mode', 'dark');
    this.inDarkMode = true;
  }
}
