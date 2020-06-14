import { Directive, HostBinding, HostListener, Input } from '@angular/core';

import { AnalyticsDeprecatedService } from '../services/analytics-deprecated.service';
import { LotteriesService } from '../../../services/lotteries/lotteries.service';
import { LotteryInterface } from '../../api/entities/incoming/lotteries/lotteries.interface';


@Directive({
  selector: '[appProductLink]'
})
export class ProductLinkDirective {
  /**
   * lotteryId
   */
  @Input() appProductLink: string;

  @Input() listKey: string;
  @Input() position: number;

  constructor(private analyticsDeprecatedService: AnalyticsDeprecatedService,
              private lotteriesService: LotteriesService) {
  }

  @HostListener('click', ['$event'])
  onClick() {
    const lotteryId: string = this.appProductLink;

    this.lotteriesService.getLottery(lotteryId)
      .first()
      .subscribe((lottery: LotteryInterface) => {
        this.analyticsDeprecatedService.trackProductPromotionClick(this.listKey, this.position, lottery);
      });
  }
}
