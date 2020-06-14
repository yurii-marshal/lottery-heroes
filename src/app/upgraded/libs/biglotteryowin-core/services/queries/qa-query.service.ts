import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';
import { Observable } from 'rxjs/Observable';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { getRouterStateUrl, RouterStateUrl } from '@libs/router-store/reducers';

@Injectable()
export class QaQueryService {
  private nullJackpotIds$: Observable<string[]>;

  constructor(private store: Store<RouterReducerState<RouterStateUrl>>) {
  }

  getNullJackpotIds(): Observable<string[]> {
    if (!this.nullJackpotIds$) {
      this.nullJackpotIds$ = this.store.select(getRouterStateUrl)
        .pipe(
          map((routerStateUrl: RouterStateUrl) => {
            let nullJackpotIds = [];
            if (typeof routerStateUrl.queryParams['qa-nojackpot'] !== 'undefined') {
              nullJackpotIds = routerStateUrl.queryParams['qa-nojackpot'].split(',');
            }
            return nullJackpotIds;
          }),
          publishReplay(1),
          refCount(),
        );
    }

    return this.nullJackpotIds$;
  }
}
