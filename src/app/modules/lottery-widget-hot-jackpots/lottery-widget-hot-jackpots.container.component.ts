import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { LotteryItemModel } from './lottery-item.model';
import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';
import { LotteryModel } from '@libs/biglotteryowin-core/models/lottery.model';

import { LotteriesQueryService } from '@libs/biglotteryowin-core/services/queries/lotteries-query.service';
import { SyndicatesQueryService } from '@libs/biglotteryowin-core/services/queries/syndicates-query.service';

import { combineLatest } from 'rxjs/observable/combineLatest';
import { first, map } from 'rxjs/operators';
import { LotteriesSortService } from '../../services/lotteries/lotteries-sort.service';


@Component({
  selector: 'app-lottery-widget-hot-jackpots-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-lottery-widget-hot-jackpots
      [items]="items$ | async"
    ></app-lottery-widget-hot-jackpots>`,
})
export class LotteryWidgetHotJackpotsContainerComponent implements OnInit {
  items$: Observable<LotteryItemModel[]>;

  constructor(private lotteriesQueryService: LotteriesQueryService,
              private syndicatesQueryService: SyndicatesQueryService,
              private lotteriesSortService: LotteriesSortService) { }

  ngOnInit() {
    this.items$ = this.getItems();
  }

  private getItems() {
    return combineLatest(
      this.lotteriesSortService.getLotteriesIdsSortedList('upcoming').map(ids => ids.slice(0, 3)),
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
              name: lotteries[id] ? lotteries[id].name : syndicates[id].lotteryName,
              logo: lotteries[id] ? lotteries[id].logo : syndicates[id].lotteryLogo,
              slug: lotteries[id] ? lotteries[id].slug : syndicates[id].lotterySlug,
              jackpot: lotteries[id] ? lotteries[id].jackpot : syndicates[id].jackpot,
              minJackpot: lotteries[id] ? lotteries[id].minJackpot : syndicates[id].minJackpot,
              currencyId: lotteries[id] ? lotteries[id].currencyId : syndicates[id].currencyId,
              time: lotteries[id] ? lotteries[id].lastTicketTime : syndicates[id].stopSellTime,
            });
          });

          return items;
        })
      );
  }

}
