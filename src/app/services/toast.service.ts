import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable()
export class ToastService {
    constructor(private _messageService: MessageService) {}

    /**
     * @param {string} summary
     */
    public successToast(summary: string): void {
        this._messageService.add({
            severity: 'success',
            summary: summary,
            closable: true,
            styleClass: 'toast-default'
        });
    }

    /**
     * @param {string} summary
     */
    public errorToast(summary: string): void {
        this._messageService.add({
            severity: 'custom',
            summary: summary,
            closable: true,
            styleClass: 'toast-default p-toast-message-error',
            icon: 'pi-exclamation-circle'
        });
    }
}
