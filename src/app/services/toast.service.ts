import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable()
export class ToastService {
  readonly #messageService = inject(MessageService);

  successToast(summary: string): void {
    this.#messageService.add({
      severity: 'success',
      summary,
      closable: true,
      styleClass: 'toast-default'
    });
  }

  errorToast(summary: string): void {
    this.#messageService.add({
      severity: 'custom',
      summary,
      closable: true,
      styleClass: 'toast-default p-toast-message-error',
      icon: 'pi-exclamation-circle'
    });
  }
}
