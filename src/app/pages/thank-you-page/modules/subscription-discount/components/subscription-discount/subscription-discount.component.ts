import { Component, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { LotteriesMapInterface } from '../../../../../../services/lotteries/entities/interfaces/lotteries-map.interface';

@Component({
  selector: 'app-subscription-discount',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './subscription-discount.component.html',
  styleUrls: ['./subscription-discount.component.scss'],
})
export class SubscriptionDiscountComponent implements OnChanges {
  @Input() lotteriesMap: LotteriesMapInterface;
  @Input() currencyId: string;
  @Input() lastOrderSubscriptionsPriceMap: {[lotteryId: string]: {price: number, discount: number}};

  @Output() addSubscriptionsToCartEvent = new EventEmitter<void>();

  lotteryIds: Array<string>;
  totalSubscriptionsPrice: number;
  totalSubscriptionsDiscount: number;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lastOrderSubscriptionsPriceMap'] && changes['lastOrderSubscriptionsPriceMap'].currentValue !== null) {
      this.lotteryIds = Object.keys(this.lastOrderSubscriptionsPriceMap);

      this.totalSubscriptionsPrice = Object.keys(this.lastOrderSubscriptionsPriceMap)
        .reduce((result, lotteryId) => result + this.lastOrderSubscriptionsPriceMap[lotteryId].price, 0);

      this.totalSubscriptionsDiscount = Object.keys(this.lastOrderSubscriptionsPriceMap)
        .reduce((result, lotteryId) => result + this.lastOrderSubscriptionsPriceMap[lotteryId].discount, 0);
    }
  }
}
