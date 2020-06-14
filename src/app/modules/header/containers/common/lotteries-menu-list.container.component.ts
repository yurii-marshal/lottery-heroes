import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map } from 'rxjs/operators';

import { LotteriesQueryService } from '@libs/biglotteryowin-core/services/queries/lotteries-query.service';

@Component({
  selector: 'app-lotteries-menu-list-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-lotteries-menu-list
      class="hidden-sm-down"
      [lotteryIds]="lotteryIds$|async|slice:0:8"
    ></app-lotteries-menu-list>
    <app-lotteries-menu-list-mobile
      class="hidden-md-up"
      [lotteryIds]="lotteryIds$|async|slice:0:3"
    ></app-lotteries-menu-list-mobile>
  `
})
export class LotteriesMenuListContainerComponent {
  lotteryIds$: Observable<string[]>;

  constructor(private lotteriesQueryService: LotteriesQueryService) {
    this.lotteryIds$ = combineLatest(
      this.lotteriesQueryService.getLotteriesPopularityOrder(),
      this.lotteriesQueryService.getSoldLotteryModelsMap(),
    ).pipe(
      map(([order, soldLotteries]) => order.filter(lotteryId => typeof soldLotteries[lotteryId] !== 'undefined'))
    );
  }
}
