import {
  Component, ChangeDetectionStrategy, Input, AfterViewInit,
} from '@angular/core';

import { AnalyticsDeprecatedService } from '../../../../../modules/analytics-deprecated/services/analytics-deprecated.service';

@Component({
  selector: 'app-results',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements AfterViewInit {
  @Input() lotteriesOrder: Array<string>;

  constructor(private analyticsDeprecatedService: AnalyticsDeprecatedService) {}

  ngAfterViewInit(): void {
    this.analyticsDeprecatedService.trackListImpressions(this.lotteriesOrder, 'results');
  }
}
