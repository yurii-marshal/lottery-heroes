import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { OfferingsService } from '../../../../services/offerings/offerings.service';
import { filter, first, map, switchMap } from 'rxjs/operators';
import {
  OfferFreeLinesInterface,
  OfferingsFreeLinesOffersMapInterface
} from '../../../../modules/api/entities/incoming/offerings/offerings-offers.interface';
import { LotteriesService } from '../../../../services/lotteries/lotteries.service';
import { Observable } from 'rxjs/Observable';
import { LotteryInterface } from '../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { DrawsService } from '../../../../services/lotteries/draws.service';
import { DrawInterface } from '../../../../modules/api/entities/incoming/lotteries/draws.interface';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { CartLotteryItemModel } from '../../../../models/cart/cart-lottery-item.model';
import { Cart2LotteryService } from '../../../../services/cart2/cart2-lottery.service';
import { Router } from '@angular/router';
import { ObjectsUtil } from '../../../../modules/shared/utils/objects.util';
import { TicketsService } from '../../../../services/tickets.service';
import { of } from 'rxjs/observable/of';
import { OfferingsPricesMapInterface } from '../../../../modules/api/entities/incoming/offerings/offerings-prices.interface';
import { LineInterface } from '../../../../modules/api/entities/outgoing/common/line.interface';
import { Cart2Service } from '../../../../services/cart2/cart2.service';

@Component({
  selector: 'app-offer-5-1-lottery-box-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-offer-5-1-lottery-box
      *ngIf="(lottery$ | async) !== null"
      [lottery]="lottery$ | async"
      [freeLineOffer] = "freeLineOffer$  |async"
      [upcomingDraw]="upcomingDraw$ | async"
      [upcomingDrawLinePrice]="upcomingDrawLinePrice$ | async"
      [lines]="lines$ | async"
      [boxName]="boxName"
      [boxNumber]="boxNumber"
      (redirectToCart)="redirectToCart($event)"
    ></app-offer-5-1-lottery-box>
  `
})
export class Offer51LotteryBoxContainerComponent implements OnInit, OnChanges {

  @Input() draw: DrawInterface;
  @Input() boxName: string;
  @Input() boxNumber: number;

  lottery$: Observable<LotteryInterface>;
  upcomingDraw$: Observable<DrawInterface>;
  lines$: Observable<LineInterface[]>;
  upcomingDrawLinePrice$: Observable<number>;
  freeLineOffer$: Observable<OfferFreeLinesInterface>;

  constructor(private offeringsService: OfferingsService,
              private lotteriesService: LotteriesService,
              private drawsService: DrawsService,
              private cart2Service: Cart2Service,
              private cart2LotteryService: Cart2LotteryService,
              private router: Router,
              private ticketsService: TicketsService) {}

  ngOnInit(): void {
    this.lottery$ = this.offeringsService.getFreeLinesOffersMap()
      .pipe(
        switchMap((freeLinesOffersMap: OfferingsFreeLinesOffersMapInterface) => {
          const lotteryId = Object.keys(freeLinesOffersMap).find((key: string) => {
            return freeLinesOffersMap[key].details.lines_to_qualify === 5 &&
              freeLinesOffersMap[key].details.lines_free === 1;
          });

          this.freeLineOffer$ = this.offeringsService.getLotteryFreeLinesOffer(lotteryId);

          return this.lotteriesService.getLottery(lotteryId);
        }),
        filter((lottery: LotteryInterface | undefined) => typeof lottery !== 'undefined' && lottery !== null)
      );

    this.upcomingDraw$ = this.lottery$.publishReplay(1).refCount()
      .pipe(
        switchMap((lottery: LotteryInterface) => this.drawsService.getUpcomingDraw(lottery.id))
      );

    this.upcomingDrawLinePrice$ = combineLatest(
      this.offeringsService.getPrices(),
      this.upcomingDraw$.publishReplay(1).refCount()
    )
      .pipe(
        switchMap(([offeringsPricesMap, upcomingDraw]: [OfferingsPricesMapInterface, DrawInterface]) => {
          return of(OfferingsService.findLotteryLinePrice(offeringsPricesMap, upcomingDraw.lottery_id, upcomingDraw.id));
        }),
        filter((upcomingDrawLinePrice: number | null) => upcomingDrawLinePrice !== null)
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
      this.lottery$.publishReplay(1).refCount(),
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
    }

}
