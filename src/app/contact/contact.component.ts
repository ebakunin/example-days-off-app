import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import { AppService } from '../services/app.service';
import { LanguageService } from '../services/language.service';
import { MessageService } from 'primeng/api';

import { CommonValidators } from '../shared/common.validator';
import { environment } from '../../environments/environment.prod';
import { ApiResponseType } from '../shared/common.type';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent implements OnInit {
    public readonly translations = new Map<string, string>();
    public form!: FormGroup;
    public visible = false;

    private readonly _destroy$ = new Subject<boolean>();

    constructor(private _appService: AppService,
                private _cdr: ChangeDetectorRef,
                private _http: HttpClient,
                private _languageService: LanguageService,
                private _messageService: MessageService) {}

    /**
     *
     */
    public ngOnInit(): void {
        this._setVisibility();
        this._setTranslations(['Message success', 'Message error']);
        this._setupForm();
    }

    /**
     * Cancel subscriptions.
     */
    public ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.complete();
    }

    /**
     *
     */
    public onSendMessage(): void {
        const path = 'http://www.ericchristenson.com/email.php';
        const body = 'message=' + encodeURIComponent(this.form.get('message')?.value.trim())
            + '&name=' + encodeURIComponent(this.form.get('name')?.value.trim())
            + '&email=' + encodeURIComponent(this.form.get('email')?.value.trim());
        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            'llave': environment.key
        });

        this._http.post<ApiResponseType>(path, body, {headers}).pipe(take(1)).subscribe(result => {
            this._appService.showContactDialog$.next(false);
            if (result.response === 200) {
                this._showSuccessToast();
            } else {
                this._showErrorToast(result.message);
            }
        }, (error: HttpErrorResponse) => {
            this._showErrorToast(error.message);
            this._appService.showContactDialog$.next(false);
        });
    }

    /**
     * @private
     */
    private _showSuccessToast(): void {
        this._messageService.add({
            severity: 'success',
            summary: this.translations.get('Message success'),
            closable: true
        });
    }

    /**
     * @param {string} errorMessage
     * @private
     */
    private _showErrorToast(errorMessage: string): void {
        this._messageService.add({
            severity: 'custom',
            summary: `${this.translations.get('Message error')}: ${errorMessage}`,
            closable: true,
            styleClass: 'p-toast-message-error',
            icon: 'pi-exclamation-circle'
        });
    }

    /**
     * @private
     */
    private _setVisibility(): void {
        this._appService.showContactDialog$.pipe(filter(Boolean), takeUntil(this._destroy$))
            .subscribe(visible => {
                this.visible = visible as boolean;
                this._cdr.detectChanges();
            });
    }

    /**
     * @private
     */
    private _setupForm(): void {
        this.form = new FormGroup({
            message: new FormControl('', CommonValidators.requiredTrimmed),
            name: new FormControl('', CommonValidators.requiredTrimmed),
            email: new FormControl('', [Validators.required, Validators.email]),
        });
    }

    /**
     * @private
     */
    private _setTranslations(tokens: string[]): void {
        this._languageService.translate$(tokens).pipe(takeUntil(this._destroy$)).subscribe(terms => {
            terms.forEach((term, index) => {
                this.translations.set(tokens[index], term);
            });
        });
    }
}
