import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class SpinnerService {
    readonly showSpinner$ = new BehaviorSubject<boolean>(false);

    start(): void {
        this.showSpinner$.next(true);
    }

    stop(): void {
        this.showSpinner$.next(false);
    }
}
