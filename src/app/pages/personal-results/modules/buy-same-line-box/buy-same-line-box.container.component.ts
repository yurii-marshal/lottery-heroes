import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DrawInterface } from '../../../../modules/api/entities/incoming/lotteries/draws.interface';
import { Observable } from 'rxjs/Observable';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { DrawsService } from '../../../../services/lotteries/draws.service';
import { LotteriesService } from '../../../../services/lotteries/lotteries.service';
import { LotteryInterface } from '../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { OfferingsService } from '../../../../services/offerings/offerings.service';
import { CurrencyService } from '../../../../services/auth/currency.service';
import { TicketsService } from '../../../../services/tickets.service';
import { Router } from '@angular/router';
import { CartLotteryItemModel } from '../../../../models/cart/cart-lottery-item.model';
import { Cart2LotteryService } from '../../../../services/cart2/cart2-lottery.service';
import { ObjectsUtil } from '../../../../modules/shared/utils/objects.util';
import { of } from 'rxjs/observable/of';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { OfferingsPricesMapInterface } from '../../../../services/api/entities/incoming/offerings/offerings-prices.interface';
import { LineInterface } from '../../../../modules/api/entities/outgoing/common/line.interface';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../store/reducers';
import * as personalResultsActions from '../../../../store/actions/personal-results.actions';

@Component({
  selector: 'app-buy-same-line-box-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-buy-same-line-box
      [upcomingDraw]="upcomingDraw$ | async"
      [lottery]="lottery$ | async"
      [upcomingDrawLinePrice]="upcomingDrawLinePrice$ | async"
      [lines]="lines$ | async"
      (redirectToCart)="redirectToCart()"
    ></app-buy-same-line-box>
  `
})
export class BuySameLineBoxContainerComponent implements OnChanges, AfterViewInit {

  @Input() draw: DrawInterface;
  @Input() boxName: string;
  @Input() boxNumber: number;

  lines$: Observable<any>;
  lottery$: Observable<LotteryInterface>;
  upcomingDraw$: Observable<DrawInterface>;
  upcomingDrawLinePrice$: Observable<number>;

  constructor(private drawsService: DrawsService,
              private lotteriesService: LotteriesService,
              private offeringsService: OfferingsService,
              private currencyService: CurrencyService,
              private ticketsService: TicketsService,
              private cart2LotteryService: Cart2LotteryService,
              private router: Router,
              private store: Store<fromRoot.State>) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['draw'] && changes['draw'].currentValue) {
      this.lines$ = this.ticketsService.getSettledLinesByDraw(this.draw.id).pipe(
        filter(res => typeof res !== 'undefined' && res !== null),
        map(res => res.lines
          .filter(line => line.line_status_id === 'won' || line.line_status_id === 'lost' || line.line_status_id === 'pending')
          .map(line => ObjectsUtil.parseLine(line))
        )
      );

      this.lottery$ = this.lotteriesService.getLottery(this.draw.lottery_id).pipe(
        filter((lottery: LotteryInterface) => typeof lottery !== 'undefined')
      );
      this.upcomingDraw$ = this.drawsService.getUpcomingDraw(this.draw.lottery_id);

      this.upcomingDrawLinePrice$ = combineLatest(
        this.upcomingDraw$.publishReplay(1).refCount(),
        this.offeringsService.getPrices()
      ).pipe(
        first(),
        switchMap(([upcomingDraw, offeringsPricesMap]: [DrawInterface, OfferingsPricesMapInterface]) => {
          return of(OfferingsService.findLotteryLinePrice(offeringsPricesMap, upcomingDraw.lottery_id, upcomingDraw.id));
        })
      );
    }
  }

  redirectToCart(): void {
    this.lines$.publishReplay(1).refCount().pipe(
      first()
    ).subscribe((lines: LineInterface[]) => {
      this.cart2LotteryService.addItems([new CartLotteryItemModel(this.draw.lottery_id, lines)]);
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
