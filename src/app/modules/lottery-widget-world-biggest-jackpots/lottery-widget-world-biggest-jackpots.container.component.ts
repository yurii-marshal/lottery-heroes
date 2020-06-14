import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { LotteryItemModel } from './lottery-item.model';
import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';
import { LotteryModel } from '@libs/biglotteryowin-core/models/lottery.model';

import { LotteriesQueryService } from '@libs/biglotteryowin-core/services/queries/lotteries-query.service';
import { SyndicatesQueryService } from '@libs/biglotteryowin-core/services/queries/syndicates-query.service';
import { LotteriesSortService } from '../../services/lotteries/lotteries-sort.service';

import { combineLatest } from 'rxjs/observable/combineLatest';
import { first, map } from 'rxjs/operators';


@Component({
  selector: 'app-lottery-widget-world-biggest-jackpots-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-lottery-widget-world-biggest-jackpots
      [items]="items$ | async"
      [lotteryIds]="lotteryIds$ | async"
    ></app-lottery-widget-world-biggest-jackpots>`,
})
export class LotteryWidgetWorldBiggestJackpotsContainerComponent implements OnInit {
  items$: Observable<LotteryItemModel[]>;
  lotteryIds$: Observable<string[]>;

  constructor(private lotteriesQueryService: LotteriesQueryService,
              private syndicatesQueryService: SyndicatesQueryService,
              private lotteriesSortService: LotteriesSortService) { }

  ngOnInit() {
    this.lotteryIds$ = this.lotteriesSortService.getLotteriesIdsSortedList('upcoming').map(ids => ids.slice(0, 5));
    this.items$ = this.getItems();
  }

  private getItems() {
    return combineLatest(
      this.lotteryIds$,
      this.syndicatesQueryService.getSyndicateModelsMap(),
      this.lotteriesQueryService.getSoldLotteryModelsMap()
    )
      .pipe(
        first(),
        map(([ids, syndicates, lotteries]: [Array<string>, {[id: string]: SyndicateModel}, {[lotteryId: string]: LotteryModel}]) => {
          const items = [];

          ids.forEach((id: string) => {
            items.push({
              type: lotteries[id] ? 'lottery' : 'syndicate',
              lotteryId: lotteries[id] ? lotteries[id].lotteryId : syndicates[id].lotteryId,
              name: lotteries[id] ? lotteries[id].name : syndicates[id].lotteryName,
              logo: lotteries[id] ? lotteries[id].logo : syndicates[id].lotteryLogo,
              slug: lotteries[id] ? lotteries[id].slug : syndicates[id].lotterySlug,
              buttonText: lotteries[id] ? 'Buy a Ticket' : 'Join',
            });
          });

          return items;
        })
      );
  }

}
