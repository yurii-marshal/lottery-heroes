import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OfferingsService } from '../../../../../services/offerings/offerings.service';
import { LotteryInterface } from '../../../../api/entities/incoming/lotteries/lotteries.interface';
import { DrawInterface } from '../../../../api/entities/incoming/lotteries/draws.interface';
import { OfferingsPricesMapInterface } from '../../../../api/entities/incoming/offerings/offerings-prices.interface';

@Component({
  selector: 'app-offers-menu-list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './offers-menu-list-item.component.html',
  styleUrls: ['./offers-menu-list-item.component.scss']
})
export class OffersMenuListItemComponent implements OnInit {
  @Input() lottery: LotteryInterface;
  @Input() upcomingDraw: DrawInterface;
  @Input() offeringsPricesMap: OfferingsPricesMapInterface;
  @Input() lineToQualify: number;
  @Input() linesFree: number;
  @Input() linesAmount: number;
  @Input() ribbonText: string;
  @Input() isShowRibbon: boolean;
  @Input() freeLineClass: string;
  @Input() lotterySlug: string;

  @Output() addToCartEvent = new EventEmitter<string>();
  @Output() oTrackMegaMenuClicked = new EventEmitter<string>();

  lotteryLinePrice: number;

  ngOnInit() {
    this.getLotteryLinePrice();
  }

  getLotteryLinePrice() {
    this.lotteryLinePrice = OfferingsService.findLotteryLinePrice(this.offeringsPricesMap, this.lottery.id, this.upcomingDraw.id);
  }

}
