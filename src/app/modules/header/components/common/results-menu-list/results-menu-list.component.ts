import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { AnalyticsDeprecatedService } from '../../../../analytics-deprecated/services/analytics-deprecated.service';

@Component({
  selector: 'app-results-menu-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './results-menu-list.component.html',
  styleUrls: ['./results-menu-list.component.scss']
})
export class ResultsMenuListComponent {
  @Input() lotteryIds: Array<string>;

  constructor(private analyticsDeprecatedService: AnalyticsDeprecatedService) {}

  onTrackNavigationClicked(label: string) {
    this.analyticsDeprecatedService.trackNavigationClicked(label);
  }
}
