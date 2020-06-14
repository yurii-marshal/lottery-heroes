import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { LotteryItemModel } from '../lottery-item.model';
import { AnalyticsDeprecatedService } from '../../analytics-deprecated/services/analytics-deprecated.service';

@Component({
  selector: 'app-lottery-widget-world-biggest-jackpots',
  templateUrl: './lottery-widget-world-biggest-jackpots.component.html',
  styleUrls: ['./lottery-widget-world-biggest-jackpots.component.scss']
})
export class LotteryWidgetWorldBiggestJackpotsComponent implements OnChanges {
  @Input() items: Array<LotteryItemModel>;
  @Input() lotteryIds: Array<string>;

  constructor(private analyticsDeprecatedService: AnalyticsDeprecatedService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.lotteryIds && changes.lotteryIds.currentValue) {
      this.analyticsDeprecatedService.trackListImpressions(this.lotteryIds, 'homeBottom');
    }
  }

  onTrackAllLotteriesClicked() {
    this.analyticsDeprecatedService.trackExploreAllLotteriesClicked();
  }
}
