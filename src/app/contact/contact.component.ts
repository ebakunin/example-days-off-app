import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { finalize, Subject } from 'rxjs';
import { distinctUntilChanged, filter, take, takeUntil } from 'rxjs/operators';

import { AppService } from '../services/app.service';
import { ToastService } from '../services/toast.service';

import { CommonValidators } from '../shared/common.validators';
import { ApiResponseType } from '../shared/common.types';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent implements OnDestroy, OnInit {
    readonly showContactDialog$ = this._appService.showContactDialog$;

    readonly form = new FormGroup({
        message: new FormControl<string>('', CommonValidators.requiredTrimmed),
        name: new FormControl<string>('', CommonValidators.requiredTrimmed),
        email: new FormControl<string>('', [Validators.required, Validators.email]),
    });

    isVisible = false;
    isSendingMessage = false;

    readonly #onDestroy$ = new Subject<boolean>();

    constructor(private _appService: AppService,
                private _cdr: ChangeDetectorRef,
                private _http: HttpClient,
                private _toastService: ToastService,
                private _translate: TranslateService) {}

    /**
     *
     */
    ngOnInit(): void {
        this.#setDialogVisibility();
    }

    /**
     * Cancel subscriptions.
     */
    ngOnDestroy(): void {
        this.#onDestroy$.next(true);
        this.#onDestroy$.complete();
    }

    /**
     *
     */
    onHide(): void {
        this.form.reset();
        this.showContactDialog$.next(false);
    }

    /**
     *
     */
    onSendMessage(): void {
        if (!this.form.valid) {
            return;
        }

        this.isSendingMessage = true;

        const path = '//www.ericchristenson.com/message';
        const body = 'message=' + encodeURIComponent(this.form.get('message')?.value?.trim() as string)
            + '&name=' + encodeURIComponent(this.form.get('name')?.value?.trim() as string)
            + '&email=' + encodeURIComponent(this.form.get('email')?.value?.trim() as string);
        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            'llave': environment.llave
        });

        this._http.post<ApiResponseType>(path, body, {headers}).pipe(
            filter((response) => response.message?.length > 0),
            take(1),
            finalize(() => {
                this.isSendingMessage = false;
                this.showContactDialog$.next(false);
            })
        ).subscribe({
            next: (result) => {
                if (result.response === 200) {
                    this._toastService.successToast(this._translate.instant('CONTACT.MESSAGE_SUCCESS'));
                } else {
                    this._toastService.errorToast(`${this._translate.instant('CONTACT.MESSAGE_ERROR')}: ${result.message}`);
                }
            },
            error: (error: HttpErrorResponse) => {
                this._toastService.errorToast(`${this._translate.instant('CONTACT.MESSAGE_ERROR')}: ${error.message}`);
            }
        });
    }

    /**
     * @private
     */
    #setDialogVisibility(): void {
        this.showContactDialog$.pipe(
            distinctUntilChanged(),
            takeUntil(this.#onDestroy$)
        ).subscribe((visible) => {
            this.isVisible = visible;
            if (this.isVisible) {
                this.form.reset();
            }

            this._cdr.markForCheck();
        });
    }
}
