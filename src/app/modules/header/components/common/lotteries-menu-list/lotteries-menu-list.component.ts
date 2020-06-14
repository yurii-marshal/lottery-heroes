import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { AnalyticsDeprecatedService } from '../../../../analytics-deprecated/services/analytics-deprecated.service';

@Component({
  selector: 'app-lotteries-menu-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lotteries-menu-list.component.html',
  styleUrls: ['./lotteries-menu-list.component.scss']
})
export class LotteriesMenuListComponent {
  @Input() lotteryIds: Array<string>;

  constructor(private analyticsDeprecatedService: AnalyticsDeprecatedService) {}

  onTrackNavigationClicked(label: string) {
   this.analyticsDeprecatedService.trackNavigationClicked(label);
  }
}
