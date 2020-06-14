import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LotteryInterface } from '../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { OfferingsService } from '../../../../services/offerings/offerings.service';
import { filter, first, map, switchMap } from 'rxjs/operators';
import {
  OfferingsSubscriptionDiscountInterface
} from '../../../../modules/api/entities/incoming/offerings/offerings-subscription-discounts.interface';
import { Observable } from 'rxjs/Observable';
import { Cart2LotteryService } from '../../../../services/cart2/cart2-lottery.service';
import { TicketsService } from '../../../../services/tickets.service';
import { DrawInterface } from '../../../../modules/api/entities/incoming/lotteries/draws.interface';
import { Router } from '@angular/router';
import { CartLotteryItemModel } from '../../../../models/cart/cart-lottery-item.model';
import { ObjectsUtil } from '../../../../modules/shared/utils/objects.util';
import { LotteriesService } from '../../../../services/lotteries/lotteries.service';
import { DrawsService } from '../../../../services/lotteries/draws.service';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { interval } from 'rxjs/observable/interval';
import { LineInterface } from '../../../../modules/api/entities/outgoing/common/line.interface';
import * as personalResultsActions from '../../../../store/actions/personal-results.actions';
import * as fromRoot from '../../../../store/reducers';
import { Store } from '@ngrx/store';

const monthlySubscription = 'P1M';

@Component({
  selector: 'app-subscribe-lines-box-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-subscribe-lines-box
      [lottery]="lottery$ | async"
      [monthlySubscriptionDiscount]="monthlySubscriptionDiscount$ | async"
      [remainingTime]="remainingTime$ | async"
      (redirectToCart)="redirectToCart()"
    ></app-subscribe-lines-box>
  `
})
export class SubscribeLinesBoxContainerComponent implements OnChanges, AfterViewInit {

  @Input() draw: DrawInterface;
  @Input() boxName: string;
  @Input() boxNumber: number;

  monthlySubscriptionDiscount$: Observable<OfferingsSubscriptionDiscountInterface>;
  lines$: Observable<LineInterface[]>;
  lottery$: Observable<LotteryInterface>;
  remainingTime$: Observable<{ hours: string, minutes: string, seconds: string}>;

  constructor(private offeringsService: OfferingsService,
              private cart2LotteryService: Cart2LotteryService,
              private ticketsService: TicketsService,
              private router: Router,
              private lotteriesService: LotteriesService,
              private drawsService: DrawsService,
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

      this.lottery$ = this.lotteriesService.getLottery(this.draw.lottery_id)
        .pipe(
          filter((lottery: LotteryInterface) => typeof lottery !== 'undefined')
        );

      this.monthlySubscriptionDiscount$ = this.offeringsService.getSubscriptionDiscounts().pipe(
        filter((subscriptionDiscounts: OfferingsSubscriptionDiscountInterface[]) => subscriptionDiscounts !== null),
        map((subscriptionDiscounts: OfferingsSubscriptionDiscountInterface[]) => {
          return subscriptionDiscounts.find((discount: OfferingsSubscriptionDiscountInterface) => {
            return discount.lottery_id === this.draw.lottery_id && discount.period === monthlySubscription;
          });
        })
      );

      this.remainingTime$ = combineLatest(
        interval(1000),
        this.drawsService.getUpcomingDraw(this.draw.lottery_id)
      ).pipe(
        switchMap(([timerNumber, upcomingDraw]: [number, DrawInterface]) => {
          const futureDate = new Date(upcomingDraw.date);
          const currentDate = new Date();

          let seconds = Math.floor((futureDate.getTime() - currentDate.getTime()) / 1000 );
          let minutes = Math.floor(seconds / 60);
          const hours = Math.floor(minutes / 60);

          minutes = minutes - (hours * 60);
          seconds = seconds - (hours * 60 * 60) - (minutes * 60);

          const parsedHours: string = (hours.toString().length < 2) ? '0' + hours : hours.toString();
          const parsedMinutes: string = (minutes.toString().length < 2) ? '0' + minutes : minutes.toString();
          const parsedSeconds: string = (seconds.toString().length < 2) ? '0' + seconds : seconds.toString();

          return of({ hours: parsedHours, minutes: parsedMinutes, seconds: parsedSeconds });
        })
      );
    }
  }

  redirectToCart(): void {
    this.lines$.publishReplay(1).refCount().pipe(
      first()
    ).subscribe((lines: LineInterface[]) => {
      this.cart2LotteryService.addItems([new CartLotteryItemModel(this.draw.lottery_id, lines, monthlySubscription)]);
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
