import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SpinnerService {
    public readonly showSpinner$ = new BehaviorSubject<boolean>(false);

    /**
     *
     */
    public start(): void {
        this.showSpinner$.next(true);
    }

    /**
     *
     */
    public stop(): void {
        this.showSpinner$.next(false);
    }
}
