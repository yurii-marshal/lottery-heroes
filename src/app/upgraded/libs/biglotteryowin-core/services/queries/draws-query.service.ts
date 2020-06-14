import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { filter, map, publishReplay, refCount, tap } from 'rxjs/operators';

import { DrawModel } from '../../models/draw.model';
import { BiglotteryowinCoreState } from '../../store/reducers';
import { DrawByDateLocalLoadAction } from '../../store/actions/draws.actions';
import { getDrawByDateLocalEntities } from '../../store/selectors/draws.selectors';

@Injectable()
export class DrawsQueryService {
  constructor(private store: Store<BiglotteryowinCoreState>) {
  }

  getDrawByDateLocal(lotteryId: string, dateLocal: string): Observable<DrawModel> {
    return this.store.select(getDrawByDateLocalEntities).pipe(
      tap((drawByDateLocalEntities) => {
        if (typeof drawByDateLocalEntities[lotteryId + '_' + dateLocal] === 'undefined') {
          this.store.dispatch(new DrawByDateLocalLoadAction({lotteryId, dateLocal}));
        }
      }),
      filter((drawByDateLocalEntities) => typeof drawByDateLocalEntities[lotteryId + '_' + dateLocal] !== 'undefined'),
      map((drawByDateLocalEntities) => new DrawModel(drawByDateLocalEntities[lotteryId + '_' + dateLocal])),
      publishReplay(1),
      refCount(),
    );
  }
}
