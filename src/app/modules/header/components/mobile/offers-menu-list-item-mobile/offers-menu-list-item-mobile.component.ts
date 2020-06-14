import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { LotteryInterface } from '../../../../api/entities/incoming/lotteries/lotteries.interface';

@Component({
  selector: 'app-offers-menu-list-item-mobile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './offers-menu-list-item-mobile.component.html',
  styleUrls: ['./offers-menu-list-item-mobile.component.scss'],
})
export class OffersMenuListItemMobileComponent {
  @Input() lottery: LotteryInterface;
  @Input() lineToQualify: number;
  @Input() linesFree: number;
  @Input() lotterySlug: string;

  @Output() addToCartEvent = new EventEmitter<string>();
  @Output() oTrackMegaMenuClicked = new EventEmitter<string>();
}
