import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { LotteriesService } from '../../../services/lotteries/lotteries.service';
import { LotteryInterface } from '../../api/entities/incoming/lotteries/lotteries.interface';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { LotteriesQueryService } from '@libs/biglotteryowin-core/services/queries/lotteries-query.service';
import { SyndicatesQueryService } from '@libs/biglotteryowin-core/services/queries/syndicates-query.service';
import { map } from 'rxjs/operators';
import { LotteryModel } from '@libs/biglotteryowin-core/models/lottery.model';
import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';

@Injectable()
export class LotterySoldGuard implements CanActivate {
  constructor(private lotteriesQueryService: LotteriesQueryService,
              private syndicatesQueryService: SyndicatesQueryService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return combineLatest(
      this.lotteriesQueryService.getSoldLotteryModelsMap(),
      this.syndicatesQueryService.getSyndicateModelsMap()
    )
      .pipe(
        map(([soldLotteriesMap, syndicatesMap]: [{[lotteryId: string]: LotteryModel}, {[lotteryId: string]: SyndicateModel}]) => {
          const lotteryId = route.data['lotteryId'];
          const isActivated = typeof soldLotteriesMap[lotteryId] !== 'undefined' || typeof syndicatesMap[lotteryId] !== 'undefined';

          if (!isActivated) {
            this.router.navigate(['/404']);
          }

          return isActivated;
        })
      );
  }
}
