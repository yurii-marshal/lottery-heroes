import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';

import { LotteryInterface } from '../../../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { DrawInterface } from '../../../../../../modules/api/entities/incoming/lotteries/draws.interface';
import { OfferFreeLinesInterface } from '../../../../../../modules/api/entities/incoming/offerings/offerings-offers.interface';

@Component({
  selector: 'app-tickets-header-mobile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tickets-header-mobile.component.html',
  styleUrls: ['./tickets-header-mobile.component.scss']
})
export class TicketsHeaderMobileComponent {
  @Input() lottery: LotteryInterface;
  @Input() upcomingDraw: DrawInterface;
  @Input() freeLinesOffers: OfferFreeLinesInterface;
  @Output() addToCartFromRibbonEvent = new EventEmitter<any>();

  addToCartFromRibbon(event, data) {
    event.preventDefault();
    this.addToCartFromRibbonEvent.emit(data);
  }
}
