import { Component, ChangeDetectionStrategy, Input, OnInit, EventEmitter, Output } from '@angular/core';

import { OfferingsService } from '../../../../../services/offerings/offerings.service';
import { OfferingsPricesMapInterface } from '../../../../api/entities/incoming/offerings/offerings-prices.interface';
import { LotteryInterface } from '../../../../api/entities/incoming/lotteries/lotteries.interface';
import { DrawInterface } from '../../../../api/entities/incoming/lotteries/draws.interface';

@Component({
  selector: 'app-lotteries-menu-list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lotteries-menu-list-item.component.html',
  styleUrls: ['./lotteries-menu-list-item.component.scss'],
})
export class LotteriesMenuListItemComponent implements OnInit {
  @Input() lottery: LotteryInterface;
  @Input() upcomingDraw: DrawInterface;
  @Input() siteCurrencySymbol: string;
  @Input() offeringsPricesMap: OfferingsPricesMapInterface;
  @Input() lineToQualify: number;
  @Input() linesFree: number;
  @Input() linesAmount: number;
  @Input() ribbonText: string;
  @Input() isShowRibbon: boolean;
  @Input() freeLineClass: string;
  @Input() isFreeLine: boolean;
  @Input() lotterySlug: string;

  @Output() addToCartEvent = new EventEmitter<string>();
  @Output() oTrackMegaMenuClicked = new EventEmitter<string>();
  @Output() oTrackHandPickNumbersClicked = new EventEmitter<string>();

  lotteryLinePrice: number;

  ngOnInit() {
    this.getLotteryLinePrice();
  }

  getLotteryLinePrice() {
    this.lotteryLinePrice = OfferingsService.findLotteryLinePrice(this.offeringsPricesMap, this.lottery.id, this.upcomingDraw.id);
  }
}
