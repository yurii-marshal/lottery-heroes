import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LotteryInterface } from '../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { CartLotteryItemModel } from '../../../../models/cart/cart-lottery-item.model';
import { Cart2LotteryService } from '../../../../services/cart2/cart2-lottery.service';
import { Router } from '@angular/router';
import { TicketsService } from '../../../../services/tickets.service';
import { DrawInterface } from '../../../../modules/api/entities/incoming/lotteries/draws.interface';
import { Observable } from 'rxjs/Observable';
import { LotteriesService } from '../../../../services/lotteries/lotteries.service';
import { ObjectsUtil } from '../../../../modules/shared/utils/objects.util';
import { DrawsService } from '../../../../services/lotteries/draws.service';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { OfferingsPricesMapInterface } from '../../../../services/api/entities/incoming/offerings/offerings-prices.interface';
import { of } from 'rxjs/observable/of';
import { OfferingsService } from '../../../../services/offerings/offerings.service';
import { LineInterface } from '../../../../modules/api/entities/outgoing/common/line.interface';
import * as personalResultsActions from '../../../../store/actions/personal-results.actions';
import * as fromRoot from '../../../../store/reducers';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-better-odds-offer-box-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-better-odds-offer-box
      [lottery]="lottery$ | async"
      [betterOddsLottery]="betterOddsLottery$ | async"
      [betterOddsLotteryUpcomingDraw]="betterOddsLotteryUpcomingDraw$ | async"
      [betterOddsLotteryLinePrice]="betterOddsLotteryLinePrice$ | async"
      (redirectToCart)="redirectToCart()"
    ></app-better-odds-offer-box>
  `
})
export class BetterOddsOfferBoxContainerComponent implements OnChanges, AfterViewInit {

  @Input() draw: DrawInterface;
  @Input() boxName: string;
  @Input() boxNumber: number;

  lottery$: Observable<LotteryInterface>;
  lines$: Observable<LineInterface[]>;
  betterOddsLottery$: Observable<{ lottery: LotteryInterface, betterOdd: number }>;
  betterOddsLotteryUpcomingDraw$: Observable<DrawInterface>;
  betterOddsLotteryLinePrice$: Observable<number>;

  constructor(private cart2LotteryService: Cart2LotteryService,
              private router: Router,
              private ticketsService: TicketsService,
              private lotteriesService: LotteriesService,
              private drawService: DrawsService,
              private offeringsService: OfferingsService,
              private store: Store<fromRoot.State>) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['draw'] && changes['draw'].currentValue) {
      this.lines$ = this.ticketsService.getSettledLines()
        .pipe(
          filter(res => typeof res !== 'undefined' && res !== null),
          map(res => res.lines.filter(line => {
              return line.draw_id === this.draw.id && (line.line_status_id === 'won' || line.line_status_id === 'lost');
            }).map(line => ObjectsUtil.parseLine(line)))
        );

      const betterOddsLotteriesIds = ['el-gordo-primitiva', 'lotto-ie'];
      const index = Math.round(Math.random());

      this.betterOddsLottery$ = this.lotteriesService.getLottery(betterOddsLotteriesIds[index])
        .pipe(
          switchMap((lottery: LotteryInterface) => {
            const betterOdd = this.lotteriesService.parseBallCombinationsMap(lottery.odds, 'valAsc')[0].val;
            return of({ lottery, betterOdd });
          })
        );

      this.betterOddsLotteryUpcomingDraw$ = this.betterOddsLottery$.publishReplay(1).refCount()
        .pipe(
          switchMap(({ lottery, betterOdd }: { lottery: LotteryInterface, betterOdd: number}) => {
            return this.drawService.getUpcomingDraw(lottery.id);
          })
        );

      this.betterOddsLotteryLinePrice$ = combineLatest(
        this.betterOddsLotteryUpcomingDraw$.publishReplay(1).refCount(),
        this.offeringsService.getPrices()
      ).pipe(
        first(),
        switchMap(([upcomingDraw, offeringsPricesMap]: [DrawInterface, OfferingsPricesMapInterface]) => {
          return of(OfferingsService.findLotteryLinePrice(offeringsPricesMap, upcomingDraw.lottery_id, upcomingDraw.id));
        })
      );

      this.lottery$ = this.lotteriesService.getLottery(this.draw.lottery_id)
        .pipe(
          filter((lottery: LotteryInterface) => typeof lottery !== 'undefined')
        );
    }
  }

  redirectToCart(): void {
    combineLatest(
      this.betterOddsLotteryUpcomingDraw$.publishReplay(1).refCount(),
      this.lines$.publishReplay(1).refCount()
    ).pipe(
      first()
    ).subscribe(([betterOddsLotteryUpcomingDraw, lines]: [DrawInterface, LineInterface[]]) => {
      lines = lines.map((line: LineInterface) => {
        line.lottery_id = betterOddsLotteryUpcomingDraw.lottery_id;
        return line;
      });
      this.cart2LotteryService.addItems([new CartLotteryItemModel(betterOddsLotteryUpcomingDraw.lottery_id, lines.slice(0, 2))]);
      this.router.navigate(['/cart']);
    });

    this.store.dispatch(new personalResultsActions.BoxClicked({
      boxName: this.boxName, boxNumber: this.boxNumber, pageUrl: this.router.url
    }));
  }

  ngAfterViewInit(): void {
    this.store.dispatch(new personalResultsActions.BoxPresented({
      boxName: this.boxName, boxNumber: this.boxNumber, pageUrl: this.router.url
    }));
  }
}
