import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { BaseSandbox } from '../../../../shared/sandbox/base.sandbox';
import { DeviceService } from '../../../../services/device/device.service';
import { LotteriesService } from '../../../../services/lotteries/lotteries.service';
import { DrawsService } from '../../../../services/lotteries/draws.service';
import { OfferingsService } from '../../../../services/offerings/offerings.service';
import { LinesService } from '../../../../services/lines.service';
import { CurrencyService } from '../../../../services/auth/currency.service';
import { GlobalService } from '../../../../services/global.service';
import { ScrollService } from '../../../../services/device/scroll.service';
import { Cart2LotteryService } from '../../../../services/cart2/cart2-lottery.service';
import { AnalyticsDeprecatedService } from '../../../../modules/analytics-deprecated/services/analytics-deprecated.service';

import { isFilledLine } from '../../../../modules/shared/utils/lines/is-filled-line';

import * as fromRoot from '../../../../store/reducers/index';
import * as ticketsActions from '../../../../store/actions/tickets.actions';
import { CartLotteryItemModel } from '../../../../models/cart/cart-lottery-item.model';
import { ExperimentsService } from '../../../../services/experiments/experiments.service';
import { LightboxesService } from '../../../../modules/lightboxes/services/lightboxes.service';
import { LuvService } from '../../../../services/luv.service';
import { BrandParamsService } from '../../../../modules/brand/services/brand-params.service';
import { Cart2Service } from '../../../../services/cart2/cart2.service';
import { CartItemModel } from '../../../../models/cart/cart-item.model';
import { Router } from '@angular/router';
import { OfferingsApiService } from '../../../../modules/api/offerings.api.service';
import { SubscriptionInterface } from '../../../../modules/api/entities/outgoing/common/subscription.interface';
import {
  OfferingsSubscriptionDiscountInterface
} from '../../../../modules/api/entities/incoming/offerings/offerings-subscription-discounts.interface';
import { OfferingsPricesMapInterface } from '../../../../modules/api/entities/incoming/offerings/offerings-prices.interface';
import { LotteryInterface, LotteryRulesInterface } from '../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { OfferFreeLinesInterface } from '../../../../modules/api/entities/incoming/offerings/offerings-offers.interface';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { LineInterface } from '../../../../modules/api/entities/outgoing/common/line.interface';
import { OfferingsTotalPriceInterface } from '../../../../modules/api/entities/incoming/offerings/offerings-total-price.interface';

@Injectable()
export class TicketsMobileSandbox extends BaseSandbox {
  constructor(protected store: Store<fromRoot.State>,
              protected deviceService: DeviceService,
              protected lotteriesService: LotteriesService,
              protected drawsService: DrawsService,
              private offeringsService: OfferingsService,
              private linesService: LinesService,
              private currencyService: CurrencyService,
              private globalService: GlobalService,
              private scrollService: ScrollService,
              private cart2LotteryService: Cart2LotteryService,
              private analyticsDeprecatedService: AnalyticsDeprecatedService,
              private experimentsService: ExperimentsService,
              private lightboxesService: LightboxesService,
              private luvService: LuvService,
              private offeringsApiService: OfferingsApiService,
              private brandParamsService: BrandParamsService,
              private cart2Service: Cart2Service,
              private router: Router) {
    super(store, deviceService, lotteriesService, drawsService);
  }

  getLotteryTickets(lotteryId: string): Observable<LineInterface[]> {
    return this.store.select(fromRoot.getTickets)
      .map((tickets: {[lotteryId: string]: Array<LineInterface>}) => tickets[lotteryId] || []);
  }

  getEditedTicket(lotteryId: string): Observable<LineInterface | undefined> {
    return this.store.select(fromRoot.getEditedTickets)
      .map((tickets: {[lotteryId: string]: LineInterface}) => tickets[lotteryId]);
  }

  setEditedTicket(lotteryId: string, ticket: LineInterface): void {
    this.store.dispatch(new ticketsActions.SetEditedTicket({lotteryId, ticket}));
  }

  deleteEditedTicket(lotteryId: string): void {
    this.store.dispatch(new ticketsActions.DeleteEditedTicket({lotteryId}));
  }

  getFilledLotteryTickets(lotteryId: string): Observable<LineInterface[]> {
    return combineLatest(
      this.getLotteryTickets(lotteryId),
      this.getLotteryRules(lotteryId),
    )
      .map(data => {
        const lines: Array<LineInterface> = data[0];
        const rules: LotteryRulesInterface = data[1];

        return lines
          .filter(line => isFilledLine(line, rules));
      });
  }

  getTotalPriceAmount$(currencyId: string,
                       lines: Array<LineInterface>,
                       subscriptions: Array<SubscriptionInterface>): Observable<OfferingsTotalPriceInterface> {
    return this.offeringsApiService.getTotalPrice(this.brandParamsService.getBrandId(), currencyId, lines, [], [], subscriptions);
  }

  getNonFreeFilledLotteryLines(lotteryId: string): Observable<LineInterface[]> {
    return combineLatest(
      this.getLotteryTickets(lotteryId),
      this.getLotteryRules(lotteryId),
    )
      .map(data => {
        const lines: Array<LineInterface> = data[0];
        const rules: LotteryRulesInterface = data[1];

        return lines
          .filter(line => !line.isFree)
          .filter(line => isFilledLine(line, rules));
      });
  }

  getFreeFilledLotteryLines(lotteryId: string): Observable<LineInterface[]> {
    return combineLatest(
      this.getLotteryTickets(lotteryId),
      this.getLotteryRules(lotteryId),
    )
      .map(data => {
        const lines: Array<LineInterface> = data[0];
        const rules: LotteryRulesInterface = data[1];

        return lines
          .filter(line => line.isFree)
          .filter(line => isFilledLine(line, rules));
      });
  }

  getSiteCurrencySymbol(): Observable<string> {
    return this.currencyService.getCurrencySymbol();
  }

  getSiteCurrencyId$(): Observable<string> {
    return this.currencyService.getCurrencyId();
  }

  getLotterySubscriptionRenewPeriods(lotteryId: string): Observable<OfferingsSubscriptionDiscountInterface[]> {
    return this.offeringsService.getLotterySubscriptionDiscounts(lotteryId);
  }

  getFreeLinesOffer(lotteryId: string): Observable<OfferFreeLinesInterface | null> {
    return this.offeringsService.getLotteryFreeLinesOffer(lotteryId);
  }

  private getFreeLotteryLines(lotteryId: string): Observable<LineInterface[]> {
    return this.getLotteryTickets(lotteryId)
      .map(lines => lines.filter(line => line.isFree));
  }

  private getFilledNonFreeLotteryLines(lotteryId: string): Observable<LineInterface[]> {
    return combineLatest(
      this.getLotteryTickets(lotteryId),
      this.getLotteryRules(lotteryId),
    )
      .map(data => {
        const lines: Array<LineInterface> = data[0];
        const rules: LotteryRulesInterface = data[1];

        return lines
          .filter(line => !line.isFree)
          .filter(line => isFilledLine(line, rules));
      });
  }

  getOpenedFreeLineIds(lotteryId: string): Observable<string[]> {
    return combineLatest(
      this.getFreeLinesOffer(lotteryId),
      this.getFilledNonFreeLotteryLines(lotteryId),
      this.getFreeLotteryLines(lotteryId),
    )
      .map(data => {
        const freeLinesOffer: OfferFreeLinesInterface | null = data[0];
        const numberOfFilledNonFreeLotteryLines: number = data[1].length;
        const freeLotteryLineIds: Array<string> = data[2].map(line => line.id);

        if (freeLinesOffer === null) {
          return [];
        }

        let numberOfOpenedFreeLines: number;

        if (freeLinesOffer.details.is_multiplied) {
          numberOfOpenedFreeLines = Math.floor(numberOfFilledNonFreeLotteryLines / freeLinesOffer.details.lines_to_qualify)
            * freeLinesOffer.details.lines_free;
        } else {
          numberOfOpenedFreeLines = Math.floor(numberOfFilledNonFreeLotteryLines / freeLinesOffer.details.lines_to_qualify) >= 1
            ? freeLinesOffer.details.lines_free
            : 0;
        }

        return freeLotteryLineIds.slice(0, numberOfOpenedFreeLines);
      })
      .distinctUntilChanged();
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

  deleteLines(lotteryId: string, lines: Array<LineInterface>): void {
    this.store.dispatch(new ticketsActions.DeleteLotteryTickets({lotteryId, tickets: lines}));
  }

  generateLine(lotteryId: string): LineInterface {
    return this.linesService.generateLine(lotteryId);
  }

  generateAutoselectedLine(lotteryId: string): LineInterface {
    return this.linesService.generateAutoselectedLine(lotteryId);
  }

  generateAutoselectedLines(lotteryId: string, numberOfLinesToGenerate: number): Array<LineInterface> {
    return this.linesService.generateAutoselectedLines(lotteryId, numberOfLinesToGenerate);
  }

  generateAutoselectedFreeLine(lotteryId: string): LineInterface {
    return this.linesService.generateAutoselectedFreeLine(lotteryId);
  }

  autoselectLine(line: LineInterface): LineInterface {
    return this.linesService.autoselect(line, false);
  }

  addFooterClass(className: string): void {
    this.globalService.addFooterClass(className);
  }

  removeFooterClass(className: string): void {
    this.globalService.removeFooterClass(className);
  }

  scrollToTop(): void {
    this.scrollService.toTop();
  }

  scrollTo(nativeElement: HTMLElement): void {
    this.scrollService.scrollToSmooth(nativeElement);
  }

  saveToCart(lotteryId: string, filledLines: Array<LineInterface>, renewPeriod: string | null): void {
    this.cart2LotteryService.addItems([new CartLotteryItemModel(lotteryId, filledLines, renewPeriod)]);
  }

  activateExperimentsElements() {
    this.experimentsService.activate();
  }

  showLightbox(type: string, title: string, message: string): void {
    this.lightboxesService.show({
      type: type,
      title: title,
      message: message,
    });
  }

  getPrices$(): Observable<OfferingsPricesMapInterface | null> {
    return this.offeringsService.getPrices();
  }

  getSelectedLotteryId$(): Observable<string> {
    return this.store.select(fromRoot.getSelectedLotteryId)
      .filter((lotteryId: string | null) => lotteryId !== null);
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

  addDefiniteLotteryItemsToCart(lines: Array<CartLotteryItemModel>): void {
    this.cart2LotteryService.addItems(lines);
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

  trackLotteryClearLineClick(): void {
    this.analyticsDeprecatedService.trackLotteryClearLineClick();
  }

  trackLotteryAutoSelectLineClick(): void {
    this.analyticsDeprecatedService.trackLotteryAutoSelectLineClick();
  }

  trackLotteryAddToCartClick(totalPrice: number, totalLines: number, lottery: LotteryInterface): void {
    this.analyticsDeprecatedService.trackLotteryAddToCartClick(totalPrice, 0, totalLines, lottery);
  }

  trackLotteryNumberSelect(): void {
    this.analyticsDeprecatedService.trackLotteryNumberSelect();
  }

  trackTicketPickDoneClicked() {
    this.analyticsDeprecatedService.trackTicketPickDoneClicked();
  }
}
