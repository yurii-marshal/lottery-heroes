import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { AnalyticsDeprecatedService } from '../../../../analytics-deprecated/services/analytics-deprecated.service';
import { LotteryInterface } from '../../../../api/entities/incoming/lotteries/lotteries.interface';
import { DrawInterface } from '../../../../api/entities/incoming/lotteries/draws.interface';
import { LotteriesService } from '../../../../../services/lotteries/lotteries.service';

@Component({
  selector: 'app-results-menu-list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './results-menu-list-item.component.html',
  styleUrls: ['./results-menu-list-item.component.scss'],
})
export class ResultsMenuListItemComponent implements OnChanges {
  @Input() lottery: LotteryInterface;
  @Input() latestDraw: DrawInterface;

  lotterySlug: string;

  constructor(private analyticsDeprecatedService: AnalyticsDeprecatedService,
              private lotteriesService: LotteriesService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.lottery && changes.lottery.currentValue) {
      this.lotterySlug = this.lotteriesService.getSlugByLottery(this.lottery);
    }
  }

  oTrackMegaMenuClicked(lotteryName: string) {
    this.analyticsDeprecatedService.trackMegaMenuClicked('results', lotteryName);
  }
}
