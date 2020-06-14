import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { LotteryInterface } from '../../api/entities/incoming/lotteries/lotteries.interface';
import { LotteriesService } from '../../../services/lotteries/lotteries.service';
import { VisitorCountryInterface } from '../../../services/api/entities/incoming/visitor-country.interface';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../store/reducers/index';
import * as lotteryResultsActions from '../../../store/actions/lottery-results.action';
import { filter, first, map, pluck, switchMap, } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { SyndicatesQueryService } from '@libs/biglotteryowin-core/services/queries/syndicates-query.service';
import { LotteriesMapInterface } from '../../../services/lotteries/entities/interfaces/lotteries-map.interface';
import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';

@Component({
  selector: 'app-lottery-widgets-conversion-lightbox-container',
  template: `<app-lottery-widgets-conversion-lightbox
              *ngIf="soldLottery$ | async"
              [lotteryId]="lotteryId"
              [soldLottery]="soldLottery$|async"
              [country]="country"
              [lotterySlug]="lotterySlug$ | async"

              (show)="onShowConversionLightBox($event)"
              (close)="onCloseConversionLightBox($event)"
              (cancel)="onCancel($event)"
              (goToPlay)="onGoToPlay($event)"
             ></app-lottery-widgets-conversion-lightbox>`
})
export class LotteryWidgetsConversionLightboxContainerComponent implements OnInit, OnDestroy {
  @Input() lotteryId: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  soldLottery$: Observable<LotteryInterface | SyndicateModel>;
  country: string;
  lotterySlug$: Observable<string>;

  constructor(private lotteriesService: LotteriesService,
              private store: Store<fromRoot.State>,
              private syndicatesQueryService: SyndicatesQueryService) { }

  ngOnInit() {
    this.soldLottery$ = combineLatest(
      this.lotteriesService.getSoldLotteriesMap(),
      this.syndicatesQueryService.getSyndicateModelByLotteryId(this.lotteryId)
    )
      .pipe(
        first(),
        map(([ soldLotteriesMap, syndicateLottery ]: [ LotteriesMapInterface, SyndicateModel ]) => {
          return (typeof syndicateLottery !== 'undefined') ?
            syndicateLottery : soldLotteriesMap[this.lotteryId];
        })
      );

    this.store.select(fromRoot.getVisitorCountry)
    .takeUntil(this.ngUnsubscribe)
      .filter(data => Object.keys(data).length !== 0)
      .first()
      .subscribe(
        (data: VisitorCountryInterface) => this.country = data['country'].name,
        error => this.country = 'United Kingdom'
      );

    this.lotterySlug$ = this.lotteriesService.getSlug(this.lotteryId);
  }

  // Analytics events
  onShowConversionLightBox(event) {
    if (event.show) {
      this.store.dispatch(new lotteryResultsActions.ShowConversionLightBox({lotteryName: event.lotteryName}));
    }
  }

  onCloseConversionLightBox(lotteryName) {
    this.store.dispatch(new lotteryResultsActions.ClickConversionClose({lotteryName: lotteryName}));
  }

  onGoToPlay(lotteryName) {
    this.store.dispatch(new lotteryResultsActions.ClickConversionToTicketPage({lotteryName: lotteryName}));
  }

  onCancel(lotteryName) {
    this.store.dispatch(new lotteryResultsActions.ClickConversionCancel({lotteryName: lotteryName}));
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
