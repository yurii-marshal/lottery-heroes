import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import {
  OfferingsSubscriptionDiscountInterface
} from '../../../../../../modules/api/entities/incoming/offerings/offerings-subscription-discounts.interface';

@Component({
  selector: 'app-ticket-subscriptions-mobile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ticket-subscriptions-mobile.component.html',
  styleUrls: ['./ticket-subscriptions-mobile.component.scss']
})
export class TicketSubscriptionsMobileComponent {
  @Input() renewPeriods: Array<OfferingsSubscriptionDiscountInterface>;
  @Input() selectedRenewPeriod: string | null;

  @Output() subscriptionTooltipClickEvent = new EventEmitter<void>();
  @Output() changeRenewPeriodEvent = new EventEmitter<{label: string, value: string | null}>();

  changeRenewPeriod(label: string, e) {
    if (e.target.checked) {
      this.changeRenewPeriodEvent.emit({label, value: 'P1M'});
    } else {
      this.changeRenewPeriodEvent.emit({label, value: null});
    }
  }
}
