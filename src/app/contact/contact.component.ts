import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { distinctUntilChanged, filter, take, takeUntil, tap } from 'rxjs/operators';

import { AppService } from '../services/app.service';
import { LanguageService } from '../services/language.service';
import { ToastService } from '../services/toast.service';

import { CommonValidators } from '../shared/common.validator';
import { ApiResponseType } from '../shared/common.type';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent implements OnDestroy, OnInit {
    public readonly showContactDialog$ = this._appService.showContactDialog$;

    public readonly form = new FormGroup({
        message: new FormControl('', CommonValidators.requiredTrimmed),
        name: new FormControl('', CommonValidators.requiredTrimmed),
        email: new FormControl('', [Validators.required, Validators.email]),
    });

    public visible = false;
    public sendingMessage = false;

    private readonly _destroy$ = new Subject<boolean>();

    constructor(private _appService: AppService,
                private _cdr: ChangeDetectorRef,
                private _http: HttpClient,
                private _languageService: LanguageService,
                private _toastService: ToastService) {}

    /**
     *
     */
    public ngOnInit(): void {
        this._setDialogVisibility();
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
    public onHide(): void {
        this.form.reset();
        this.showContactDialog$.next(false);
    }

    /**
     *
     */
    public onSendMessage(): void {
        if (!this.form.valid) {
            return;
        }

        this.sendingMessage = true;

        const path = '//www.ericchristenson.com/message';
        const body = 'message=' + encodeURIComponent(this.form.get('message')?.value.trim())
            + '&name=' + encodeURIComponent(this.form.get('name')?.value.trim())
            + '&email=' + encodeURIComponent(this.form.get('email')?.value.trim());
        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            'llave': environment.llave
        });

        this._http.post<ApiResponseType>(path, body, {headers}).pipe(
            filter(d => d.message?.length > 0),
            take(1),
            tap(() => {
                this.sendingMessage = false;
                this.showContactDialog$.next(false);
            })
        ).subscribe({
            next: result => {
                if (result.response === 200) {
                    this._toastService.successToast(this._languageService.getTranslation('UI_MESSAGE_SUCCESS'));
                } else {
                    this._toastService.errorToast(`${this._languageService.getTranslation('UI_MESSAGE_ERROR')}: ${result.message}`);
                }
            },
            error: (error: HttpErrorResponse) => {
                this._toastService.errorToast(`${this._languageService.getTranslation('UI_MESSAGE_ERROR')}: ${error.message}`);
            }
        });
    }

    /**
     * @private
     */
    private _setDialogVisibility(): void {
        this.showContactDialog$.pipe(distinctUntilChanged(), takeUntil(this._destroy$))
            .subscribe(visible => {
                this.visible = visible;
                if (this.visible) {
                    this.form.reset();
                }

                this._cdr.detectChanges();
            }
        );
    }
}
