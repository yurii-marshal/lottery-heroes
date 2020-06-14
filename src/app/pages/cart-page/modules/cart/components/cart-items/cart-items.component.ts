import {
  Component, Input, Output, EventEmitter, SimpleChanges, OnChanges, ChangeDetectionStrategy, OnInit, OnDestroy
} from '@angular/core';

import { OfferingsTotalPriceInterface } from '../../../../../../modules/api/entities/incoming/offerings/offerings-total-price.interface';
import { BalanceInterface } from '../../../../../../services/api/entities/incoming/wallet/balance.interface';
import { LotteriesMapInterface } from '../../../../../../services/lotteries/entities/interfaces/lotteries-map.interface';
import { DrawsMapInterface } from '../../../../../../services/lotteries/entities/interfaces/draws-map.interface';

import { CartNgSelectInterface } from '../../entities/cart-ng-select.interface';
import { CartLotteryItemModel } from '../../../../../../models/cart/cart-lottery-item.model';
import { CartItemModel } from '../../../../../../models/cart/cart-item.model';
import { DeviceService } from '../../../../../../services/device/device.service';
import { CartItemPriceMap } from '../../../../../../services/cart2/entities/cart-item-price-map';
import { BrandParamsService } from '../../../../../../modules/brand/services/brand-params.service';
import { OfferingsFreeLinesOffersMapInterface } from '../../../../../../modules/api/entities/incoming/offerings/offerings-offers.interface';
import { ArraysUtil } from '../../../../../../modules/shared/utils/arrays.util';
import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';

@Component({
  selector: 'app-cart-items',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cart-items.component.html',
  styleUrls: ['./cart-items.component.scss']
})
export class CartItemsComponent implements OnChanges, OnInit, OnDestroy {
  @Input() items: Array<any>;
  @Input() totalPriceWithDiscount: OfferingsTotalPriceInterface;
  @Input() balance: BalanceInterface;
  @Input() siteCurrencyId: string;
  @Input() freeLinesOffersMap: OfferingsFreeLinesOffersMapInterface;
  @Input() lotteriesMap: LotteriesMapInterface;
  @Input() upcomingDrawsMap: DrawsMapInterface;
  @Input() itemPriceMap: CartItemPriceMap;
  @Input() lotteryIdsNotInCart: string[];
  @Input() placeholder: string;
  @Input() optionsList: Array<CartNgSelectInterface>;
  @Input() expandedLines: boolean;

  @Output() checkoutEvent = new EventEmitter<void>();

  isShowSpecialOffers = false;
  breakdownIsOpen = true;
  device: string;
  status = 'Show';
  minimumDeposit: number;

  private aliveSubscriptions = true;

  constructor(private deviceService: DeviceService,
              private brandParamsService: BrandParamsService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['freeLinesOffersMap'] || changes['items']) {
      this.isShowSpecialOffers = this.checkSpecialOffers();
    }
  }

  checkSpecialOffers(): boolean {
    const lotteryIdsInCart: Array<string> = this.items.filter((item: CartItemModel) => item.type === 'lottery')
      .map((item: CartLotteryItemModel) => item.lotteryId);
    const offersLotteryIds: Array<string> = Object.keys(this.freeLinesOffersMap);

    return ArraysUtil.intersection(lotteryIdsInCart, offersLotteryIds).length > 0;
  }

  trackByItemId(index: number, item: CartItemModel): string {
    return item.id;
  }

  ngOnInit(): void {
    this.deviceService.getDevice().takeWhile(() => this.aliveSubscriptions).subscribe((device) => {
      this.device = device;
    });
    this.brandParamsService.getConfig('minimumDeposit')
      .subscribe(minDeposit => this.minimumDeposit = minDeposit);
  }

  ngOnDestroy() {
    this.aliveSubscriptions = false;
  }

}
