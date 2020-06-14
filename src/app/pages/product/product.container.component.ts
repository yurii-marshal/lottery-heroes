import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LotteriesQueryService } from '@libs/biglotteryowin-core/services/queries/lotteries-query.service';
import { SyndicatesQueryService } from '@libs/biglotteryowin-core/services/queries/syndicates-query.service';
import { Data } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';
import { map } from 'rxjs/operators';
import { LotteryModel } from '@libs/biglotteryowin-core/models/lottery.model';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Store } from '@ngrx/store';
import { getRouterStateUrl, RouterStateUrl } from '@libs/router-store/reducers';
import * as fromRoot from '../../store/reducers/index';

@Component({
  selector: 'app-product-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container [ngSwitch]="lotteryType$ | async">
      <app-tickets-page-container *ngSwitchCase="'lottery'"></app-tickets-page-container>
      <app-syndicate-page-container *ngSwitchCase="'syndicate'"></app-syndicate-page-container>
      <app-page404 *ngSwitchDefault></app-page404>
    </ng-container>
  `
})
export class ProductContainerComponent implements OnInit {
  lotteryType$: Observable<string>;

  constructor(private lotteriesQueryService: LotteriesQueryService,
              private syndicatesQueryService: SyndicatesQueryService,
              private store: Store<fromRoot.State>) {}

  ngOnInit(): void {
    this.lotteryType$ = combineLatest(
      this.store.select(getRouterStateUrl).pipe(map((routerStateUrl: RouterStateUrl) => routerStateUrl.data['lotteryId'])),
      this.lotteriesQueryService.getSoldLotteryModelsMap(),
      this.syndicatesQueryService.getSyndicateModelsMap()
    )
      .pipe(
        map(data => {
          const lotteryId: string = data[0];
          const soldLotteriesMap: { [lotteryId: string]: LotteryModel } = data[1];
          const syndicatesMap: { [lotteryId: string]: SyndicateModel } = data[2];
          let lotteryType: string;

          if (typeof soldLotteriesMap[lotteryId] !== 'undefined') {
            lotteryType = 'lottery';
          } else if (typeof syndicatesMap[lotteryId] !== 'undefined') {
            lotteryType = 'syndicate';
          }

          return lotteryType;
        })
      );
  }
}
