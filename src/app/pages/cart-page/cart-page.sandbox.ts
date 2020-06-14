import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { BaseSandbox } from '../../shared/sandbox/base.sandbox';
import * as fromRoot from '../../store/reducers/index';
import { DeviceService } from '../../services/device/device.service';
import { LotteriesService } from '../../services/lotteries/lotteries.service';
import { DrawsService } from '../../services/lotteries/draws.service';
import { MetaService } from '../../modules/meta/services/meta.service';
import { Cart2Service } from '../../services/cart2/cart2.service';
import { Cart2LotteryService } from '../../services/cart2/cart2-lottery.service';
import { Cart2ComboService } from '../../services/cart2/cart2-combo.service';
import { LinesService } from '../../services/lines.service';
import { OfferingsService } from '../../services/offerings/offerings.service';

import { SegmentationIdsInterface } from '../../services/lotteries/entities/interfaces/segmentation.interface';
import { OfferingsCombosMapInterface } from '../../services/offerings/entities/offerings-combos-map.interface';
import { CartLotteryItemModel } from '../../models/cart/cart-lottery-item.model';
import { CartItemModel } from '../../models/cart/cart-item.model';
import { CartComboItemModel } from '../../models/cart/cart-combo-item.model';
import { CartItemType } from '../../services/cart2/entities/cart-item.type';
import { LuvService } from '../../services/luv.service';

import * as walletActions from '../../store/actions/wallet.actions';
import {
  OfferingsSubscriptionDiscountInterface
} from '../../modules/api/entities/incoming/offerings/offerings-subscription-discounts.interface';
import { LineInterface } from '../../modules/api/entities/outgoing/common/line.interface';
import { OfferingsComboInterface } from '../../modules/api/entities/incoming/offerings/offerings-combos.interface';

@Injectable()
export class CartPageSandbox extends BaseSandbox {
  constructor(protected store: Store<fromRoot.State>,
              protected deviceService: DeviceService,
              protected lotteriesService: LotteriesService,
              protected drawsService: DrawsService,
              private metaService: MetaService,
              private cart2Service: Cart2Service,
              private cart2LotteryService: Cart2LotteryService,
              private cart2ComboService: Cart2ComboService,
              private linesService: LinesService,
              private luvService: LuvService,
              private offeringsService: OfferingsService) {
    super(store, deviceService, lotteriesService, drawsService);
  }

  getSegmentationIdsMap$(): Observable<SegmentationIdsInterface> {
    return this.lotteriesService.getSegmentationIdsMap();
  }

  getActiveCombosMap$(): Observable<OfferingsCombosMapInterface> {
    return this.offeringsService.getActiveCombosMap();
  }

  getSubscriptionRenewPeriods(): Observable<OfferingsSubscriptionDiscountInterface[]> {
    return this.offeringsService.getSubscriptionDiscounts();
  }

  clearCart(): void {
    return this.cart2Service.clear();
  }

  addToCart(type: CartItemType, items: Array<CartItemModel>): void {
    switch (type) {
      case 'lottery':
        this.cart2LotteryService.addItems(items as Array<CartLotteryItemModel>);
        break;
      case 'combo':
        this.cart2ComboService.addItems(items as Array<CartComboItemModel>);
        break;
    }
  }

  generateLine(lotteryId: string, mainNumbers: Array<number> = [], extraNumbers: Array<number> = []): LineInterface {
    return this.linesService.generateLine(lotteryId, mainNumbers, extraNumbers);
  }

  autoselectLine(line: LineInterface): LineInterface {
    return this.linesService.autoselect(line, false);
  }

  generateAutoselectedLines(lotteryId: string, numberOfLinesToGenerate: number): Array<LineInterface> {
    return this.linesService.generateAutoselectedLines(lotteryId, numberOfLinesToGenerate);
  }

  generateComboLines(combo: OfferingsComboInterface): Array<LineInterface> {
    return this.cart2ComboService.generateLines(combo);
  }

  setSkipFirstDrawParam(value: string | null): void {
    this.store.dispatch(new walletActions.SetSkipFirstDrawParam(value));
  }

  setMeta(): void {
    this.metaService.setFromConfig('page', 'cart');
  }
}
