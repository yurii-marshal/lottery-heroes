import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { LotteriesService } from '../../../../services/lotteries/lotteries.service';
import { OfferingsService } from '../../../../services/offerings/offerings.service';
import { LinesService } from '../../../../services/lines.service';
import { DrawsService } from '../../../../services/lotteries/draws.service';
import { CurrencyService } from '../../../../services/auth/currency.service';
import { Cart2LotteryService } from '../../../../services/cart2/cart2-lottery.service';
import { AnalyticsDeprecatedService } from '../../../../modules/analytics-deprecated/services/analytics-deprecated.service';

import { isFilledLine } from '../../../../modules/shared/utils/lines/is-filled-line';
import { isPartiallyFilledLine } from '../../../../modules/shared/utils/lines/is-partially-filled-line';

import * as fromRoot from '../../../../store/reducers/index';
import * as ticketsActions from '../../../../store/actions/tickets.actions';
import { LuckyNumbersService } from '../../../../services/lotteries/lucky-numbers.service';
import { LuckyNumbersItemInterface } from '../../../../services/api/entities/incoming/lotteries/lucky-numbers.interface';
import { AuthService } from '../../../../services/auth/auth.service';
import { CartLotteryItemModel } from '../../../../models/cart/cart-lottery-item.model';
import { Cart2Service } from '../../../../services/cart2/cart2.service';
import { CartItemModel } from '../../../../models/cart/cart-item.model';
import { BrandParamsService } from '../../../../modules/brand/services/brand-params.service';
import { Router } from '@angular/router';
import { OfferingsApiService } from '../../../../modules/api/offerings.api.service';
import { OfferingsPricesMapInterface } from '../../../../modules/api/entities/incoming/offerings/offerings-prices.interface';
import { SubscriptionInterface } from '../../../../modules/api/entities/outgoing/common/subscription.interface';
import {
  OfferingsSubscriptionDiscountInterface
} from '../../../../modules/api/entities/incoming/offerings/offerings-subscription-discounts.interface';
import { LotteryInterface, LotteryRulesInterface } from '../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { DrawInterface } from '../../../../modules/api/entities/incoming/lotteries/draws.interface';
import {
  OfferDisplayPropertiesInterface,
  OfferFreeLinesInterface
} from '../../../../modules/api/entities/incoming/offerings/offerings-offers.interface';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { LineInterface } from '../../../../modules/api/entities/outgoing/common/line.interface';
import { OfferingsTotalPriceInterface } from '../../../../modules/api/entities/incoming/offerings/offerings-total-price.interface';

@Injectable()
export class TicketsDesktopSandbox {
  constructor(private store: Store<fromRoot.State>,
              private lotteriesService: LotteriesService,
              private offeringsService: OfferingsService,
              private linesService: LinesService,
              private drawsService: DrawsService,
              private currencyService: CurrencyService,
              private cart2Service: Cart2Service,
              private cart2LotteryService: Cart2LotteryService,
              private analyticsDeprecatedService: AnalyticsDeprecatedService,
              private luckyNumbersService: LuckyNumbersService,
              private authService: AuthService,
              private brandParamsService: BrandParamsService,
              private offeringsApiService: OfferingsApiService,
              private router: Router) {
  }

  setSelectedLotteryId(lotteryId: string | null): void {
    this.store.dispatch(new ticketsActions.SelectLotteryIdAction(lotteryId));
  }

  getSelectedLotteryId$(): Observable<string> {
    return this.store.select(fromRoot.getSelectedLotteryId)
      .filter((lotteryId: string | null) => lotteryId !== null);
  }

  getLottery$(): Observable<LotteryInterface> {
    return this.getSelectedLotteryId$()
      .switchMap((lotteryId: string) => this.lotteriesService.getLottery(lotteryId));
  }

  getRules$(): Observable<LotteryRulesInterface> {
    return this.getSelectedLotteryId$()
      .switchMap((lotteryId: string) => this.lotteriesService.getLotteryRules(lotteryId));
  }

  getUpcomingDraw$(): Observable<DrawInterface> {
    return this.getSelectedLotteryId$()
      .switchMap((lotteryId: string) => this.drawsService.getUpcomingDraw(lotteryId));
  }

  getLines$(): Observable<LineInterface[]> {
    return this.store.select(fromRoot.getSelectedLotteryLines);
  }

  getFilledOpenedLines$(): Observable<LineInterface[]> {
    return combineLatest(
      this.getNonFreeFilledLines$(),
      this.getOpenedFreeFilledLines$(),
    )
      .map(data => data[0].concat(data[1]));
  }

  getNonFreeNonFilledLines$(): Observable<LineInterface[]> {
    return combineLatest(
      this.getRules$(),
      this.getLines$(),
    )
      .map(data => {
        const rules: LotteryRulesInterface = data[0];
        const lines: Array<LineInterface> = data[1];

        return lines
          .filter((line: LineInterface) => !line.isFree)
          .filter((line: LineInterface) => !isFilledLine(line, rules));
      })
      .distinctUntilChanged();
  }

  getNonFreeFilledLines$(): Observable<LineInterface[]> {
    return combineLatest(
      this.getRules$(),
      this.getLines$(),
    )
      .map(data => {
        const rules: LotteryRulesInterface = data[0];
        const lines: Array<LineInterface> = data[1];

        return lines
          .filter((line: LineInterface) => !line.isFree)
          .filter((line: LineInterface) => isFilledLine(line, rules));
      })
      .distinctUntilChanged();
  }

  getNonFreeFilledLinesNumber$(): Observable<number> {
    return this.getNonFreeFilledLines$().map(lines => lines.length);
  }

  getNonFreePartiallyFilledLines$(): Observable<LineInterface[]> {
    return combineLatest(
      this.getRules$(),
      this.getLines$(),
    )
      .map(data => {
        const rules: LotteryRulesInterface = data[0];
        const lines: Array<LineInterface> = data[1];

        return lines
          .filter((line: LineInterface) => !line.isFree)
          .filter((line: LineInterface) => isPartiallyFilledLine(line, rules));
      })
      .distinctUntilChanged();
  }

  private getOpenedFreeLines$(): Observable<LineInterface[]> {
    return combineLatest(
      this.getFreeLinesOffer$(),
      this.getNonFreeFilledLinesNumber$(),
      this.getLines$(),
    )
      .map(data => {
        const freeLinesOffer: OfferFreeLinesInterface | null = data[0];
        const nonFreeFilledLinesNumber: number = data[1];
        const lines: Array<LineInterface> = data[2];

        if (freeLinesOffer === null) {
          return [];
        }

        let openedFreeLinesNumber: number;
        if (freeLinesOffer.details.is_multiplied) {
          openedFreeLinesNumber = Math.floor(nonFreeFilledLinesNumber / freeLinesOffer.details.lines_to_qualify)
            * freeLinesOffer.details.lines_free;
        } else {
          openedFreeLinesNumber = Math.floor(nonFreeFilledLinesNumber / freeLinesOffer.details.lines_to_qualify) >= 1
            ? freeLinesOffer.details.lines_free
            : 0;
        }

        const freeLines: Array<LineInterface> = lines
          .filter((line: LineInterface) => line.isFree);

        return freeLines.slice(0, openedFreeLinesNumber);
      })
      .distinctUntilChanged();
  }

  getOpenedFreeLineIds$(): Observable<string[]> {
    return this.getOpenedFreeLines$()
      .map(lines => lines.map(line => line.id));
  }

  getOpenedFreeLinesNumber$(): Observable<number> {
    return this.getOpenedFreeLines$()
      .map(lines => lines.length);
  }

  getFilledLines$(): Observable<LineInterface[]> {
    return combineLatest(
      this.getLines$(),
      this.getRules$(),
    )
      .map(data => data[0].filter(line => isFilledLine(line, data[1])));
  }

  getOpenedFreePartiallyFilledLines$(): Observable<LineInterface[]> {
    return combineLatest(
      this.getOpenedFreeLines$(),
      this.getRules$(),
    )
      .map(data => data[0].filter(line => isPartiallyFilledLine(line, data[1])));
  }

  getOpenedFreeFilledLines$(): Observable<LineInterface[]> {
    return combineLatest(
      this.getOpenedFreeLines$(),
      this.getRules$(),
    )
      .map(data => data[0].filter(line => isFilledLine(line, data[1])));
  }

  getAlmostOpenedFreeLines$(): Observable<LineInterface[]> {
    return combineLatest(
      this.getFreeLinesOffer$(),
      this.getNonFreeFilledLinesNumber$(),
      this.getNonFreePartiallyFilledLines$().map(lines => lines.length),
      this.getLines$(),
    )
      .map(data => {
        const freeLinesOffer: OfferFreeLinesInterface | null = data[0];
        const almostReadyLinesNumber: number = data[1] + data[2];
        const lines: Array<LineInterface> = data[3];

        if (freeLinesOffer === null) {
          return [];
        }

        let openedFreeLinesNumber: number;
        if (freeLinesOffer.details.is_multiplied) {
          openedFreeLinesNumber = Math.floor(almostReadyLinesNumber / freeLinesOffer.details.lines_to_qualify)
            * freeLinesOffer.details.lines_free;
        } else {
          openedFreeLinesNumber = Math.floor(almostReadyLinesNumber / freeLinesOffer.details.lines_to_qualify) >= 1
            ? freeLinesOffer.details.lines_free
            : 0;
        }

        const freeLines: Array<LineInterface> = lines
          .filter((line: LineInterface) => line.isFree);

        return freeLines.slice(0, openedFreeLinesNumber);
      })
      .distinctUntilChanged();
  }

  getFreeLinesOffer$(): Observable<OfferFreeLinesInterface | null> {
    return this.getSelectedLotteryId$()
      .switchMap((lotteryId: string) => this.offeringsService.getLotteryFreeLinesOffer(lotteryId));
  }

  getFreeLinesOfferDisplayProperties$(): Observable<OfferDisplayPropertiesInterface | null> {
    return this.getFreeLinesOffer$()
      .map((freeLinesOffer: OfferFreeLinesInterface | null) => freeLinesOffer ? freeLinesOffer.display_properties : null);
  }

  getPrices$(): Observable<OfferingsPricesMapInterface | null> {
    return this.offeringsService.getPrices();
  }

  getTotalPriceAmount$(currencyId: string,
                 lines: Array<LineInterface>,
                 subscriptions: Array<SubscriptionInterface>): Observable<OfferingsTotalPriceInterface> {
    return this.offeringsApiService.getTotalPrice(this.brandParamsService.getBrandId(), currencyId, lines, [], [], subscriptions);
  }

  getSiteCurrencyId$(): Observable<string> {
    return this.currencyService.getCurrencyId();
  }

  getLotterySubscriptionRenewPeriods(): Observable<OfferingsSubscriptionDiscountInterface[]> {
    return this.getSelectedLotteryId$()
      .switchMap((lotteryId: string) => this.offeringsService.getLotterySubscriptionDiscounts(lotteryId));
  }

  setLines(lotteryId: string, lines: Array<LineInterface>): void {
    this.store.dispatch(new ticketsActions.SetLotteryTickets({lotteryId, tickets: lines}));
  }

  addLines(lotteryId: string, lines: Array<LineInterface>): void {
    this.store.dispatch(new ticketsActions.AddLotteryTickets({lotteryId, tickets: lines}));
  }

  updateLines(lotteryId: string, lines: Array<LineInterface>): void {
    this.store.dispatch(new ticketsActions.UpdateLotteryTickets({lotteryId, tickets: lines}));
  }

  generateLines(lotteryId: string, numberOfLinesToGenerate: number, numberOfFreeLinesToGenerate = 0,
                quickPick?: number | undefined): Array<LineInterface> {

    if (typeof quickPick !== 'undefined') {
      return this.linesService.generateAutoselectedLines(
        lotteryId,
        numberOfLinesToGenerate,
        numberOfFreeLinesToGenerate
      );

    } else {
      return this.linesService.generateLines(
        lotteryId,
        numberOfLinesToGenerate,
        numberOfFreeLinesToGenerate
      );
    }
  }

  getMinLinesToBuy$(): Observable<number> {
    return this.getSelectedLotteryId$()
      .switchMap((lotteryId: string) => combineLatest(
        this.lotteriesService.getLottery(lotteryId),
        this.cart2Service.getItems$(),
      ))
      .map(([lottery, items]: [LotteryInterface, Array<CartItemModel>]) =>
        this.cart2LotteryService.getMinLotteryLinesNeedToBuy(lottery, items));
  }

  createDefiniteLotteryItem$(linesAmount: number) {
    return this.getSelectedLotteryId$()
      .switchMap((lotteryId: string) => combineLatest(
        this.lotteriesService.getLottery(lotteryId),
        this.cart2Service.getItems$(),
      ))
      .map(([lottery, items]: [LotteryInterface, Array<CartItemModel>]) =>
        this.cart2LotteryService.createMinLotteryItem(lottery, items, true, linesAmount));
  }

  saveToCart(lotteryId: string,
             filledLines: Array<LineInterface>,
             renewPeriod: string | null): void {
    this.cart2LotteryService.addItems([new CartLotteryItemModel(lotteryId, filledLines, renewPeriod)]);
  }

  addDefiniteLotteryItemsToCart(lines: Array<CartLotteryItemModel>): void {
    this.cart2LotteryService.addItems(lines);
  }

  saveLuckyNumbers(luckyNumbersGroups: Array<LuckyNumbersItemInterface>): void {
    this.luckyNumbersService.createGroups(luckyNumbersGroups).subscribe();
  }

  setLuckyNumbersLineStatus(lotteryId, lineId, status): void {
    this.store.dispatch(new ticketsActions.SetLuckyNumbersLineStatus({lotteryId, lineId, status}));
  }

  getLuckyNumbersLineStatuses(): Observable<{[lineId: string]: boolean}> {
    return this.store.select(fromRoot.getSelectedLotteryLuckyNumbersLineStatuses);
  }

  getLuckyNumbers(): Observable<any> {
    return this.luckyNumbersService.getLuckyNumbers();
  }

  loadLuckyNumbers(): void {
    this.luckyNumbersService.loadLuckyNumbers();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  addToCartEvent([lotteryId, linesAmount]): void {
    combineLatest(
      this.lotteriesService.getLottery(lotteryId),
      this.cart2Service.getItems$(),
    )
      .first()
      .subscribe(([lottery, items]) => {
        const item = this.cart2LotteryService.createMinLotteryItem(lottery, items, true, linesAmount);
        this.cart2LotteryService.addItems([item]);
        this.router.navigate(['/cart']);
      });
  }

  trackLotteryType(lotteryId: string, numberOfAddedLines: number): void {
    this.analyticsDeprecatedService.trackLotteryType(lotteryId, numberOfAddedLines);
  }

  trackLotteryAddLinesEvent(): void {
    this.analyticsDeprecatedService.trackLotteryAddLinesEvent();
  }

  trackLotteryAutoSelectLineEvent(): void {
    this.analyticsDeprecatedService.trackLotteryAutoSelectLineClick();
  }

  trackLotteryAutoSelectAllEvent(): void {
    this.analyticsDeprecatedService.trackLotteryAutoSelectAllEvent();
  }

  trackLotteryClearLineEvent(): void {
    this.analyticsDeprecatedService.trackLotteryClearLineClick();
  }

  trackLotteryClearAllEvent(): void {
    this.analyticsDeprecatedService.trackLotteryClearAllEvent();
  }

  trackToggleLineEvent(): void {
    this.analyticsDeprecatedService.trackLotteryNumberSelect();
  }

  trackLotteryAddToCartClick(totalPrice: number, totalLines: number, lottery: LotteryInterface): void {
    this.analyticsDeprecatedService.trackLotteryAddToCartClick(totalPrice, 0, totalLines, lottery);
  }

  trackSaveLuckyNumbers(countClicks: number): void {
    this.analyticsDeprecatedService.trackSaveLuckyNumbers(countClicks);
  }

  trackMyLuckyNumbersBtnClicked(countLines: number): void {
    this.analyticsDeprecatedService.trackMyLuckyNumbersBtnClicked(countLines);
  }

}
