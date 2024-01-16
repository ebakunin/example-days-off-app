import {Injectable} from '@angular/core';
import {MessageService} from 'primeng/api';

@Injectable()
export class ToastService {
    constructor(private _messageService: MessageService) {}

    successToast(summary: string): void {
        this._messageService.add({
            severity: 'success',
            summary,
            closable: true,
            styleClass: 'toast-default'
        });
    }

    errorToast(summary: string): void {
        this._messageService.add({
            severity: 'custom',
            summary,
            closable: true,
            styleClass: 'toast-default p-toast-message-error',
            icon: 'pi-exclamation-circle'
        });
    }
}
