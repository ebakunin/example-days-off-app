import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AppService {
    public readonly showExplanation$ = new BehaviorSubject<boolean>(false);
    public readonly showContactDialog$ = new BehaviorSubject<boolean>(false);
}
