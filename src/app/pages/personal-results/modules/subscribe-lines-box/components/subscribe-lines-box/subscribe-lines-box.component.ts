import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  OfferingsSubscriptionDiscountInterface
} from '../../../../../../modules/api/entities/incoming/offerings/offerings-subscription-discounts.interface';
import { LotteryInterface } from '../../../../../../modules/api/entities/incoming/lotteries/lotteries.interface';

@Component({
  selector: 'app-subscribe-lines-box',
  templateUrl: './subscribe-lines-box.component.html',
  styleUrls: ['./subscribe-lines-box.component.scss']
})
export class SubscribeLinesBoxComponent {

  @Input() lottery: LotteryInterface;
  @Input() monthlySubscriptionDiscount: OfferingsSubscriptionDiscountInterface;
  @Input() remainingTime: { hours: string, minutes: string, seconds: string };

  @Output() redirectToCart = new EventEmitter();
}
