import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ArraysUtil } from '../../../../modules/shared/utils/arrays.util';

import { LotteriesMapInterface } from '../../../../services/lotteries/entities/interfaces/lotteries-map.interface';
import { DrawsMapInterface } from '../../../../services/lotteries/entities/interfaces/draws-map.interface';
import { OfferingsFreeLinesOffersMapInterface } from '../../../../modules/api/entities/incoming/offerings/offerings-offers.interface';
import { LotteryInterface } from '../../../../modules/api/entities/incoming/lotteries/lotteries.interface';

import { SyndicatesQueryService } from '@libs/biglotteryowin-core/services/queries/syndicates-query.service';
import { Cart2SyndicateService } from '../../../../services/cart2/cart2-syndicate.service';
import { LotteriesSortService } from '../../../../services/lotteries/lotteries-sort.service';

import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';
import { CartSyndicateItemModel } from '../../../../models/cart/cart-syndicate-item.model';
import { CartItemModel } from '../../../../models/cart/cart-item.model';
import { BrandQueryService } from '@libs/biglotteryowin-core/services/queries/brand-query.service';
import { AddToCartOffersModel } from './models/add-to-cart-offers.model';
import { LotteriesService } from '../../../../services/lotteries/lotteries.service';
import { DrawsService } from '../../../../services/lotteries/draws.service';
import { OfferingsService } from '../../../../services/offerings/offerings.service';
import { Cart2Service } from '../../../../services/cart2/cart2.service';
import { Cart2LotteryService } from '../../../../services/cart2/cart2-lottery.service';
import { AnalyticsDeprecatedService } from '../../../../modules/analytics-deprecated/services/analytics-deprecated.service';

@Component({
  selector: 'app-add-to-cart-offers-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-add-to-cart-offers
      [addToCartOffersModelList]="addToCartOffersModelList$ | async"

      (addToCartEvent)="onAddToCartEvent($event)"
      (addToCartFromRibbonEvent)="addToCartFromRibbonEvent($event)"
      (addToCartSyndicateEvent)="onAddToCartSyndicateEvent($event)"
    ></app-add-to-cart-offers>
  `,
})
export class AddToCartOffersContainerComponent implements OnInit {
  addToCartOffersModelList$: Observable<AddToCartOffersModel[]>;

  constructor(private syndicatesQueryService: SyndicatesQueryService,
              private cart2SyndicateService: Cart2SyndicateService,
              private lotteriesSortService: LotteriesSortService,
              private brandQueryService: BrandQueryService,
              private lotteriesService: LotteriesService,
              private drawsService: DrawsService,
              private offeringsService: OfferingsService,
              private cart2Service: Cart2Service,
              private cart2LotteryService: Cart2LotteryService,
              private analyticsDeprecatedService: AnalyticsDeprecatedService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.addToCartOffersModelList$ = combineLatest(
      this.lotteriesSortService.getCartOffersLotteryIds(3),
      this.lotteriesService.getSoldLotteriesMap(),
      this.syndicatesQueryService.getSyndicateModelsMap(),
      this.drawsService.getUpcomingDrawsMap(),
      this.offeringsService.getFreeLinesOffersMap()
    )
      .pipe(
        map(data => {
          const lotteriesIds: string[] = data[0];
          const lotteriesMap: LotteriesMapInterface = data[1];
          const syndicatesMap: { [p: string]: SyndicateModel } = data[2];
          const upcomingDrawsMap: DrawsMapInterface = data[3];
          const freeLinesOffersMap: OfferingsFreeLinesOffersMapInterface = data[4];
          const addToCartOffersModelList: AddToCartOffersModel[] = [];

          lotteriesIds.forEach((lotteryId: string, index: number) => {
            if (typeof lotteriesMap[lotteryId] !== 'undefined') {
              const lottery = lotteriesMap[lotteryId];
              addToCartOffersModelList.push(new AddToCartOffersModel(
                lottery.id,
                lottery.name,
                this.lotteriesService.getSlugByLottery(lottery),
                lottery.logo,
                index + 1,
                upcomingDrawsMap[lotteryId].jackpot,
                upcomingDrawsMap[lotteryId].min_jackpot,
                upcomingDrawsMap[lotteryId].last_ticket_time,
                upcomingDrawsMap[lotteryId].currency_id,
                false,
                freeLinesOffersMap[lotteryId]
              ));
            } else if (typeof syndicatesMap[lotteryId] !== 'undefined') {
              const syndicate = syndicatesMap[lotteryId];
              addToCartOffersModelList.push(new AddToCartOffersModel(
                syndicate.lotteryId,
                syndicate.lotteryName,
                syndicate.lotterySlug,
                syndicate.lotteryLogo,
                index + 1,
                syndicate.jackpot,
                syndicate.minJackpot,
                syndicate.stopSellTime,
                syndicate.currencyId,
                true,
                freeLinesOffersMap[lotteryId],
                syndicate.templateId,
                syndicate.numLines,
                syndicate.numShares
              ));
            }
          });

          return addToCartOffersModelList;
        })
      );
  }

  onAddToCartEvent(lotteryId: string): void {
    combineLatest(
      this.lotteriesService.getLottery(lotteryId),
      this.cart2Service.getItems$(),
    )
      .first()
      .subscribe(([lottery, cartItems]: [LotteryInterface, CartItemModel[]]) => {
        const cartItem = this.cart2LotteryService.createMinLotteryItem(lottery, cartItems, true);
        this.cart2LotteryService.addItems([cartItem], false);
        this.analyticsDeprecatedService.trackCartAddToCartClick(cartItem);
      });
  }

  addToCartFromRibbonEvent([lotteryId, linesAmount]) {
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

  onAddToCartSyndicateEvent(event: {templateId: number, lotteryId: string}): void {
    this.cart2SyndicateService.addItems([new CartSyndicateItemModel(event.templateId, 1, event.lotteryId)]);
  }
}
