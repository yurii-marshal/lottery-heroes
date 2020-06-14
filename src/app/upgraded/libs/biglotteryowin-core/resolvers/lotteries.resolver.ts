import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';

import { LotteryModel } from '../models/lottery.model';
import { LotteriesQueryService } from '../services/queries/lotteries-query.service';

@Injectable()
export class LotteriesResolver implements Resolve<{[lotteryId: string]: LotteryModel}> {
  constructor(private lotteriesQueryService: LotteriesQueryService) {
  }

  resolve(): Observable<{[lotteryId: string]: LotteryModel}> {
    return this.lotteriesQueryService.getLotteryModelsMap()
      .pipe(
        first()
      );
  }
}
