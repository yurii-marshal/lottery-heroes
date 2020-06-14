import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LotteriesSortService } from '../../services/lotteries/lotteries-sort.service';
import { Observable } from 'rxjs/Observable';
import { SyndicatesQueryService } from '@libs/biglotteryowin-core/services/queries/syndicates-query.service';
import { LotteriesQueryService } from '@libs/biglotteryowin-core/services/queries/lotteries-query.service';
import { DrawsService } from '../../services/lotteries/draws.service';

import { LotteryModel } from '@libs/biglotteryowin-core/models/lottery.model';
import { LotteryItemModel } from './lottery-item.model';
import { DrawsMapInterface } from '../../services/lotteries/entities/interfaces/draws-map.interface';

import { first, map } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';


@Component({
  selector: 'app-lottery-widget-results-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-lottery-widget-results
      [items]="items$ | async"
    ></app-lottery-widget-results>
  `,
})

export class LotteryWidgetResultsContainerComponent implements OnInit {
  items$: Observable<LotteryItemModel[]>;

  constructor(private lotteriesSortService: LotteriesSortService,
              private syndicatesQueryService: SyndicatesQueryService,
              private lotteriesQueryService: LotteriesQueryService,
              private drawsService: DrawsService) {
  }

  ngOnInit(): void {
    this.items$ = this.getItems();
  }

  private getItems() {
    return combineLatest(
      this.lotteriesSortService.getLotteriesIdsSortedList('latest', true, 'datedesc').map(ids => ids.slice(0, 5)),
      this.lotteriesQueryService.getLotteryModelsMap(),
      this.drawsService.getLatestDrawsMap()
    )
      .pipe(
        first(),
        map(([ids, lotteries, latestDraws]:
               [Array<string>, {[lotteryId: string]: LotteryModel}, DrawsMapInterface]) => {
          const items = [];

          ids.forEach((id: string) => {
            if (lotteries[id]) {
              items.push({
                name: lotteries[id].name,
                logo: lotteries[id].logo,
                slug: lotteries[id].slug,
                latestDrawDateLocal: lotteries[id].latestDrawDateLocal,
                mainNumbers: latestDraws[id].winning_main_numbers,
                extraNumbers: latestDraws[id].winning_extra_numbers,
                perTicketNumbers: latestDraws[id].winning_perticket_numbers,
              });
            }
          });

          return items;
        })
      );
  }
}
