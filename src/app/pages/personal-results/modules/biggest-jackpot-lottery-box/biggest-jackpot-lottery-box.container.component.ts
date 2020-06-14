import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { LotteriesSortService } from '../../../../services/lotteries/lotteries-sort.service';
import { LotteriesService } from '../../../../services/lotteries/lotteries.service';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { LotteryInterface } from '../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { DrawsService } from '../../../../services/lotteries/draws.service';
import { DrawInterface } from '../../../../modules/api/entities/incoming/lotteries/draws.interface';
import { Observable } from 'rxjs/Observable';
import { OfferingsService } from '../../../../services/offerings/offerings.service';
import { OfferFreeLinesInterface } from '../../../../modules/api/entities/incoming/offerings/offerings-offers.interface';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { OfferingsPricesMapInterface } from '../../../../modules/api/entities/incoming/offerings/offerings-prices.interface';
import { of } from 'rxjs/observable/of';
import { CartLotteryItemModel } from '../../../../models/cart/cart-lottery-item.model';
import { TicketsService } from '../../../../services/tickets.service';
import { Cart2LotteryService } from '../../../../services/cart2/cart2-lottery.service';
import { Router } from '@angular/router';
import { ObjectsUtil } from '../../../../modules/shared/utils/objects.util';
import { LineInterface } from '../../../../modules/api/entities/outgoing/common/line.interface';
import * as fromRoot from '../../../../store/reducers';
import { Store } from '@ngrx/store';
import * as personalResultsActions from '../../../../store/actions/personal-results.actions';
import { Cart2Service } from '../../../../services/cart2/cart2.service';

@Component({
  selector: 'app-biggest-jackpot-lottery-box-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-biggest-jackpot-lottery-box
      [biggestJackpotLottery]="biggestJackpotLottery$ | async"
      [upcomingDraw]="upcomingDraw$ | async"
      [freeLineOffer]="freeLineOffer$ | async"
      [upcomingDrawLinePrice]="upcomingDrawLinePrice$ | async"
      [lines]="lines$ | async"
      (redirectToCart)="redirectToCart($event)"
    ></app-biggest-jackpot-lottery-box>
  `
})
export class BiggestJackpotLotteryBoxContainerComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() draw: DrawInterface;
  @Input() boxName: string;
  @Input() boxNumber: number;

  biggestJackpotLottery$: Observable<LotteryInterface>;
  upcomingDraw$: Observable<DrawInterface>;
  freeLineOffer$: Observable<OfferFreeLinesInterface> | null;
  upcomingDrawLinePrice$: Observable<number | null>;
  lines$: Observable<LineInterface[]>;

  constructor(private lotteriesSortService: LotteriesSortService,
              private lotteriesService: LotteriesService,
              private drawService: DrawsService,
              private offeringsService: OfferingsService,
              private ticketsService: TicketsService,
              private cart2Service: Cart2Service,
              private cart2LotteryService: Cart2LotteryService,
              private router: Router,
              private store: Store<fromRoot.State>) { }

  ngOnInit() {
    const biggestJackpotLotteryIdShared$ = this.lotteriesSortService.getLotterySuperJackpot().publishReplay(1).refCount();

    this.biggestJackpotLottery$ = biggestJackpotLotteryIdShared$
      .pipe(
        filter((lotteryId: any) => typeof lotteryId !== 'undefined' && lotteryId !== null),
        switchMap((lotteryId: string) => this.lotteriesService.getLottery(lotteryId))
      );

    this.upcomingDraw$ = biggestJackpotLotteryIdShared$
      .pipe(
        filter((lotteryId: any) => typeof lotteryId !== 'undefined' && lotteryId !== null),
        switchMap((lotteryId: string) => this.drawService.getUpcomingDraw(lotteryId))
      );

    this.freeLineOffer$ = biggestJackpotLotteryIdShared$
      .pipe(
        filter((lotteryId: any) => typeof lotteryId !== 'undefined' && lotteryId !== null),
        switchMap((lotteryId: string) => this.offeringsService.getLotteryFreeLinesOffer(lotteryId))
      );

    this.upcomingDrawLinePrice$ = combineLatest(
      this.offeringsService.getPrices(),
      this.upcomingDraw$.publishReplay(1).refCount()
    )
      .pipe(
        switchMap(([offeringsPricesMap, upcomingDraw]: [OfferingsPricesMapInterface, DrawInterface]) => {
          return of(OfferingsService.findLotteryLinePrice(offeringsPricesMap, upcomingDraw.lottery_id, upcomingDraw.id));
        })
      );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['draw'] && changes['draw'].currentValue) {
      this.lines$ = this.ticketsService.getSettledLinesByDraw(this.draw.id).pipe(
        filter(res => typeof res !== 'undefined' && res !== null),
        map(res => res.lines
          .filter(line => line.line_status_id === 'won' || line.line_status_id === 'lost' || line.line_status_id === 'pending')
          .map(line => ObjectsUtil.parseLine(line))
        )
      );
    }
  }

  redirectToCart(linesAmount): void {
    combineLatest(
      this.biggestJackpotLottery$.publishReplay(1).refCount(),
      this.cart2Service.getItems$(),
    )
      .pipe(
        first()
      )
      .subscribe(([lottery, items]: [LotteryInterface, CartLotteryItemModel[]]) => {
        const item: CartLotteryItemModel = this.cart2LotteryService.createMinLotteryItem(lottery, items, true, linesAmount);
        this.cart2LotteryService.addItems([item]);
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
