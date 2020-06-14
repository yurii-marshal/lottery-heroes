import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AccountService {
  private clickEventSource$: Subject<string>;
  clickEvent$: Observable<string>;

  constructor() {
    this.clickEventSource$ = new Subject<string>();
    this.clickEvent$ = this.clickEventSource$.asObservable();
  }

  emitClick(param: string) {
    this.clickEventSource$.next(param);
  }
}
