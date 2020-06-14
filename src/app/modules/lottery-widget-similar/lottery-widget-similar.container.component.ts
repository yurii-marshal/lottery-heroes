import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { LotteriesQueryService } from '@libs/biglotteryowin-core/services/queries/lotteries-query.service';
import { SyndicatesQueryService } from '@libs/biglotteryowin-core/services/queries/syndicates-query.service';
import { LotteryItemModel } from './lottery-item.model';
import { LotteryModel } from '@libs/biglotteryowin-core/models/lottery.model';
import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';

import { combineLatest } from 'rxjs/observable/combineLatest';
import { first, map } from 'rxjs/operators';

@Component({
  selector: 'app-lottery-widget-similar-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-lottery-widget-similar
      [items]="items$ | async | slice:0:5"
    ></app-lottery-widget-similar>
  `,
})
export class LotteryWidgetSimilarContainerComponent implements OnInit {
  items$: Observable<LotteryItemModel[]>;

  constructor(private lotteriesQueryService: LotteriesQueryService,
              private syndicatesQueryService: SyndicatesQueryService) {
  }

  ngOnInit(): void {
    this.items$ = this.getItems();
  }

  private getItems() {
    return combineLatest(
      this.lotteriesQueryService.getLotteriesPopularityOrder(),
      this.syndicatesQueryService.getSyndicateModelsMap(),
      this.lotteriesQueryService.getSoldLotteryModelsMap()
    )
      .pipe(
        first(),
        map(([ids, syndicates, lotteries]: [Array<string>, {[id: string]: SyndicateModel}, {[lotteryId: string]: LotteryModel}]) => {
          const items = [];

          ids.forEach((id: string) => {
            if (typeof lotteries[id] !== 'undefined' || typeof syndicates[id] !== 'undefined') {
              items.push({
                type: lotteries[id] ? 'lottery' : 'syndicate',
                name: lotteries[id] ? lotteries[id].name : syndicates[id].lotteryName,
                logo: lotteries[id] ? lotteries[id].logo : syndicates[id].lotteryLogo,
                slug: lotteries[id] ? lotteries[id].slug : syndicates[id].lotterySlug
              });
            }
          });

          return items;
        })
      );
  }
}
