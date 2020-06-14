import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { LotteriesService } from '../../../../services/lotteries/lotteries.service';
import { AnalyticsDeprecatedService } from '../../../analytics-deprecated/services/analytics-deprecated.service';
import { DrawInterface } from '../../../api/entities/incoming/lotteries/draws.interface';
import { LotteryInterface } from '../../../api/entities/incoming/lotteries/lotteries.interface';
import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';

@Component({
  selector: 'app-lottery-widgets-next-draw',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lottery-widgets-next-draw.component.html',
  styleUrls: ['./lottery-widgets-next-draw.component.scss']
})
export class LotteryWidgetsNextDrawComponent implements OnChanges {
  @Input() upcomingDraw: DrawInterface;
  @Input() lottery: LotteryInterface;
  @Input() isInAside: boolean;
  @Input() isSold: boolean;
  @Input() syndicate: SyndicateModel;

  lotterySlug: string;

  constructor(private lotteriesService: LotteriesService,
              private analyticsDeprecatedService: AnalyticsDeprecatedService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.lottery && changes.lottery.currentValue) {
      this.lotterySlug = this.lotteriesService.getSlugByLottery(this.lottery);
    }
  }

  isShowBetNow(): boolean {
    if (this.lottery.id === 'euromillions') {
      return true;
    } else {
      return this.lotteriesService.hasSoldBrand(this.lottery.brands);
    }
  }

  onTrackPlayNow(lotteryName: string) {
    this.analyticsDeprecatedService.trackResultPlayNowClicked(lotteryName);
  }
}
