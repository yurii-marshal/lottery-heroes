import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { OfferingsTotalPriceInterface } from '../../../../../../modules/api/entities/incoming/offerings/offerings-total-price.interface';
import { BalanceInterface } from '../../../../../../services/api/entities/incoming/wallet/balance.interface';
import { LotteriesMapInterface } from '../../../../../../services/lotteries/entities/interfaces/lotteries-map.interface';
import { DrawsMapInterface } from '../../../../../../services/lotteries/entities/interfaces/draws-map.interface';
import { CartNgSelectInterface } from '../../entities/cart-ng-select.interface';
import { CartItemModel } from '../../../../../../models/cart/cart-item.model';
import { OfferingsCombosMapInterface } from '../../../../../../services/offerings/entities/offerings-combos-map.interface';
import { JackpotFormatPipe } from '../../../../../../modules/shared/pipes/jackpot-format.pipe';
import { CartItemPriceMap } from '../../../../../../services/cart2/entities/cart-item-price-map';
import {
OfferingsFreeLinesOffersMapInterface
} from '../../../../../../modules/api/entities/incoming/offerings/offerings-offers.interface';
import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';
import {OfferingsBundlesMapInterface} from '../../../../../../services/offerings/entities/offerings-bundles-map.interface';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnChanges {
  @Input() items: Array<CartItemModel>;
  @Input() totalPriceWithDiscount: OfferingsTotalPriceInterface;
  @Input() balance: BalanceInterface;
  @Input() siteCurrencyId: string;
  @Input() freeLinesOffersMap: OfferingsFreeLinesOffersMapInterface;
  @Input() lotteriesMap: LotteriesMapInterface;
  @Input() combosMap: OfferingsCombosMapInterface;
  @Input() bundlesMap: OfferingsBundlesMapInterface;
  @Input() upcomingDrawsMap: DrawsMapInterface;
  @Input() itemPriceMap: CartItemPriceMap;
  @Input() lotteryIdsNotInCart: string[];
  @Input() expandedLines: boolean;

  @Output() checkoutEvent = new EventEmitter<void>();

  isEmptyCart = true;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['items']) {
      this.isEmptyCart = this.items.length === 0;
    }
  }
}
