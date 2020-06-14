import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { interval } from 'rxjs/observable/interval';

@Injectable()
export class RefreshService {
  private readonly minRefreshingIntervalSeconds = 10;
  private refreshEventSubject$: ReplaySubject<Date>;

  constructor() {
    this.refreshEventSubject$ = new ReplaySubject(1);
  }

  getRefreshEventEmitter(): Observable<Date> {
    return this.refreshEventSubject$.asObservable()
      .throttle(() => interval(this.minRefreshingIntervalSeconds * 1000));
  }

  emitRefreshEvent(): void {
    this.refreshEventSubject$.next(new Date());
  }
}
