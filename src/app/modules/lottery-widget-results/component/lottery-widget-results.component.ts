import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LotteryItemModel } from '../lottery-item.model';
import { AnalyticsDeprecatedService } from '../../analytics-deprecated/services/analytics-deprecated.service';

@Component({
  selector: 'app-lottery-widget-results',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lottery-widget-results.component.html',
  styleUrls: ['./lottery-widget-results.component.scss']
})
export class LotteryWidgetResultsComponent {
  @Input() items: Array<LotteryItemModel>;

  constructor(private analyticsDeprecatedService: AnalyticsDeprecatedService) {
  }

  onTrackClick(label: string, lotteryName: string) {
    this.analyticsDeprecatedService.trackResentWinnigNumberClicked(label, lotteryName);
  }

  onTrackAllResultsLinkClicked() {
    this.analyticsDeprecatedService.trackAllResultsLinkClicked();
  }

}
