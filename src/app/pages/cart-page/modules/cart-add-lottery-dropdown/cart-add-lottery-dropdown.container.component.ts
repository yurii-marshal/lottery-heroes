import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CartNgSelectInterface } from '../cart/entities/cart-ng-select.interface';
import { SyndicatesQueryService } from '@libs/biglotteryowin-core/services/queries/syndicates-query.service';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { LotteriesSortService } from '../../../../services/lotteries/lotteries-sort.service';
import { DrawsService } from '../../../../services/lotteries/draws.service';
import { first, map } from 'rxjs/operators';
import { DrawsMapInterface } from '../../../../services/lotteries/entities/interfaces/draws-map.interface';
import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';
import { LotteriesService } from '../../../../services/lotteries/lotteries.service';
import { LotteriesMapInterface } from '../../../../services/lotteries/entities/interfaces/lotteries-map.interface';
import { OfferingsService } from '../../../../services/offerings/offerings.service';
import { OfferingsFreeLinesOffersMapInterface } from '../../../../modules/api/entities/incoming/offerings/offerings-offers.interface';
import { JackpotFormatPipe } from '../../../../modules/shared/pipes/jackpot-format.pipe';
import { CartSyndicateItemModel } from '../../../../models/cart/cart-syndicate-item.model';
import { Cart2Service } from '../../../../services/cart2/cart2.service';
import { Cart2SyndicateService } from '../../../../services/cart2/cart2-syndicate.service';
import { Cart2LotteryService } from '../../../../services/cart2/cart2-lottery.service';
import { AnalyticsDeprecatedService } from '../../../../modules/analytics-deprecated/services/analytics-deprecated.service';
import { CartAddLotteryDropdownModel } from './models/cart-add-lottery-dropdown.model';
import { type } from 'os';
import { LotteryInterface } from '../../../../modules/api/entities/incoming/lotteries/lotteries.interface';

@Component({
  selector: 'app-cart-add-lottery-dropdown-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-cart-add-lottery-dropdown
      [cartAddLotteryDropdownModel]="cartAddLotteryDropdownModel$ | async"
      (addToCartEvent)="addToCartEvent($event)"
    ></app-cart-add-lottery-dropdown>
  `
})
export class CartAddLotteryDropdownContainerComponent implements OnInit {
  cartAddLotteryDropdownModel$: Observable<CartAddLotteryDropdownModel>;

  constructor(private syndicatesQueryService: SyndicatesQueryService,
              private lotteriesSortService: LotteriesSortService,
              private drawsService: DrawsService,
              private lotteriesService: LotteriesService,
              private offeringsService: OfferingsService,
              private jackpotFormatPipe: JackpotFormatPipe,
              private cart2Service: Cart2Service,
              private cart2SyndicateService: Cart2SyndicateService,
              private cart2LotteryService: Cart2LotteryService,
              private analyticsDeprecatedService: AnalyticsDeprecatedService) {}

  ngOnInit(): void {
    this.cartAddLotteryDropdownModel$ = combineLatest(
      this.lotteriesSortService.getCartOffersLotteryIds(),
      this.drawsService.getUpcomingDrawsMap(),
      this.syndicatesQueryService.getSyndicateModelsMap(),
      this.lotteriesService.getSoldLotteriesMap(),
      this.offeringsService.getFreeLinesOffersMap()
    )
      .pipe(
        map(data => {
          const lotteryIdsNotInCart: string[] = data[0];
          const upcomingDrawsMap: DrawsMapInterface = data[1];
          const syndicatesMap: { [p: string]: SyndicateModel} = data[2];
          const soldLotteriesMap: LotteriesMapInterface = data[3];
          const freeLinesOffersMap: OfferingsFreeLinesOffersMapInterface = data[4];
          const optionsList = [];

          lotteryIdsNotInCart.map((lotteryId) => {
            if (typeof soldLotteriesMap[lotteryId] !== 'undefined') {
              optionsList.push(this.generateLotteryOption(
                soldLotteriesMap[lotteryId],
                upcomingDrawsMap,
                freeLinesOffersMap
              ));
            } else if (typeof syndicatesMap[lotteryId] !== 'undefined') {
             optionsList.push(this.generateSyndicateOption(syndicatesMap[lotteryId]));
            }
          });

          return new CartAddLotteryDropdownModel(optionsList);
        })
      );
  }

  addToCartEvent(cartItem): void {
    const observableBatch = [];
    switch (cartItem.type) {
      case 'lottery': {
        observableBatch.push(this.cart2Service.getItems$());
        observableBatch.push(this.lotteriesService.getLottery(cartItem.value));
        break;
      }
      case 'syndicate': {
        observableBatch.push(this.syndicatesQueryService.getSyndicateModelByLotteryId(cartItem.value));
      }
    }

    if (observableBatch.length === 0) {
      return;
    }

    combineLatest(observableBatch)
      .pipe(
        first()
      )
      .subscribe((data) => {
        if (cartItem.type === 'lottery') {
          const items = data[0];
          const lottery = data[1];
          const item = this.cart2LotteryService.createMinLotteryItem(lottery, items, true);

          this.cart2LotteryService.addItems([item], false);
          this.analyticsDeprecatedService.trackCartAddToCartClick(item);
        } else if (cartItem.type === 'syndicate') {
          const syndicate = data[0];

          this.cart2SyndicateService.addItems([new CartSyndicateItemModel(syndicate.templateId, 1, syndicate.lotteryId)]);
        }
      });
  }

  private generateLotteryOption(lottery: LotteryInterface,
                                upcomingDrawsMap: DrawsMapInterface,
                                freeLinesOffersMap: OfferingsFreeLinesOffersMapInterface): object {
    const name = lottery.name;
    let obj;
    let jackpot;
    let jackpotMin;

    jackpot = this.jackpotFormatPipe.transform(upcomingDrawsMap[lottery.id].jackpot,
      upcomingDrawsMap[lottery.id].currency_id, 'M', 'K', false);
    jackpotMin = this.jackpotFormatPipe.transform(upcomingDrawsMap[lottery.id].min_jackpot,
      upcomingDrawsMap[lottery.id].currency_id, 'M', 'K', false);


    if (upcomingDrawsMap[lottery.id] && upcomingDrawsMap[lottery.id].jackpot) {
      obj = {
        value: lottery.id,
        label: name + ' ' + jackpot,
        type: 'lottery'
      };
    } else {
      obj = {
        value: lottery.id,
        label: name + ' ' + jackpotMin,
        type: 'lottery'
      };
    }

    if (freeLinesOffersMap[lottery.id]) {
      const lineStr = freeLinesOffersMap[lottery.id].details.lines_to_qualify === 1 ? ' Line +' : ' Lines +';

      if (upcomingDrawsMap[lottery.id] && upcomingDrawsMap[lottery.id].jackpot) {
        obj = {
          value: lottery.id,
          label: name + ' ' + jackpot,
          offerAllLines: freeLinesOffersMap[lottery.id].details.lines_to_qualify + lineStr,
          offerFreeLines: freeLinesOffersMap[lottery.id].details.lines_free + ' FREE',
          type: 'lottery'
        };
      } else {
        obj = {
          value: lottery.id,
          label: name + ' ' + jackpotMin,
          offerAllLines: freeLinesOffersMap[lottery.id].details.lines_to_qualify + lineStr,
          offerFreeLines: freeLinesOffersMap[lottery.id].details.lines_free + ' FREE',
          type: 'lottery'
        };
      }
    }

    return obj;
  }

  private generateSyndicateOption(syndicate: SyndicateModel): object {
    const jackpot = this.jackpotFormatPipe.transform(syndicate.jackpot,
      syndicate.currencyId, 'M', 'K', false);
    const jackpotMin = this.jackpotFormatPipe.transform(syndicate.minJackpot,
      syndicate.currencyId, 'M', 'K', false);

    const syndicateOption = {
      value: syndicate.lotteryId,
      label: syndicate.lotteryName + ' Syndicate ' + (syndicate.jackpot ? jackpot : jackpotMin),
      templateId: syndicate.templateId,
      sharesAmount: 1,
      type: 'syndicate'
    };

    return syndicateOption;
  }
}
