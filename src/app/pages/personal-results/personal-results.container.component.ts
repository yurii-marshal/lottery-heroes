import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CustomerInterface } from '../../services/auth/entities/interfaces/customer.interface';
import { LotteryInterface } from '../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { DrawInterface } from '../../modules/api/entities/incoming/lotteries/draws.interface';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Params } from '@angular/router';
import { CustomerService } from '../../services/auth/customer.service';
import { LotteriesService } from '../../services/lotteries/lotteries.service';
import { DrawsService } from '../../services/lotteries/draws.service';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { WalletService } from '../../services/wallet.service';
import { MetaService } from '../../modules/meta/services/meta.service';
import { AuthService } from '../../services/auth/auth.service';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../store/reducers/index';
import * as personalResultsActions from '../../store/actions/personal-results.actions';
import { OfferingsFreeLinesOffersMapInterface } from '../../modules/api/entities/incoming/offerings/offerings-offers.interface';
import { OfferingsService } from '../../services/offerings/offerings.service';
import { of } from 'rxjs/observable/of';
import { TicketsService } from '../../services/tickets.service';

@Component({
  selector: 'app-personal-results-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-personal-results
      *ngIf="(customer$ | async) !== null && isPageVisible$ | async"
      [customer]="customer$ | async"
      [lottery]="lottery$ | async"
      [draw]="draw$ | async"
      [customerSubscriptions]="customerSubscriptions$ | async"
      [offer51LotteryId]="offer51LotteryId$ | async"
    ></app-personal-results>
  `,
})
export class PersonalResultsContainerComponent implements OnInit, OnDestroy {
  customer$: Observable<CustomerInterface>;
  lottery$: Observable<LotteryInterface>;
  draw$: Observable<DrawInterface>;
  customerSubscriptions$: Observable<any[]>;
  offer51LotteryId$: Observable<string>;
  customerSettledLines$: Observable<any[]>;
  isPageVisible$: Observable<boolean>;

  private ngUnsubscribe = new Subject<void>();

  constructor(private activatedRoute: ActivatedRoute,
              private customerService: CustomerService,
              private lotteriesService: LotteriesService,
              private offeringsService: OfferingsService,
              private ticketsService: TicketsService,
              private drawsService: DrawsService,
              private walletService: WalletService,
              private metaService: MetaService,
              private authService: AuthService,
              private store: Store<fromRoot.State>) {
  }

  ngOnInit() {
    this.metaService.setFromConfig('page', 'my-account-personal-results');

    this.customer$ = this.authService.getCurrentCustomer()
      .pipe(
        tap(customer => this.authService.saveCurrentUserObj(customer)),
        switchMap(() => this.customerService.getCustomer())
      );

    const drawId$ = this.activatedRoute.params
      .pipe(
        map((params: Params) => params['drawId'])
      );

    this.draw$ = drawId$
      .pipe(
        switchMap(drawId => this.drawsService.getDraw(Number(drawId))),
        filter(draw => !!draw)
      );

    this.lottery$ = this.draw$
      .pipe(
        switchMap(draw => this.lotteriesService.getLottery(draw.lottery_id))
      );

    this.offer51LotteryId$ = this.offeringsService.getFreeLinesOffersMap()
      .pipe(
        switchMap((freeLinesOffersMap: OfferingsFreeLinesOffersMapInterface) => {
          const lotteryId = Object.keys(freeLinesOffersMap).find((key: string) => {
            return freeLinesOffersMap[key].details.lines_to_qualify === 5 &&
              freeLinesOffersMap[key].details.lines_free === 1;
          });

          return of(lotteryId);
        })
      );

    this.customerSubscriptions$ = this.walletService.getCustomerSubscriptions()
      .pipe(
        map(({subscriptions}: {subscriptions: any[]}) => subscriptions)
      );

    this.lottery$.publishReplay(1).refCount()
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((lottery: LotteryInterface) => {
        this.store.dispatch(new personalResultsActions.PageLoaded({ lotteryName: lottery.name }));
      });

    this.customerSettledLines$ = this.draw$
      .pipe(
        switchMap(draw => this.ticketsService.getSettledLinesByDraw(draw.id)
          .filter(res => typeof res !== 'undefined' && res !== null)
          .map(lines => lines.lines.filter(line => line.line_status_id === 'won' || line.line_status_id === 'lost'
            || line.line_status_id === 'pending')))
      );

    this.isPageVisible$ = this.customerSettledLines$
      .pipe(
        switchMap(lines => of(lines.length ? true : false))
      );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

