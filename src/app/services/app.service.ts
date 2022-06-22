import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AppService {
    readonly showExplanation$ = new BehaviorSubject<boolean>(false);
    readonly showContactDialog$ = new BehaviorSubject<boolean>(false);
}
