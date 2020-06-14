import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { LotteriesMapInterface } from '../../../../services/lotteries/entities/interfaces/lotteries-map.interface';
import { AnalyticsDeprecatedService } from '../../../../modules/analytics-deprecated/services/analytics-deprecated.service';
import { IOption } from 'ng-select';

@Component({
  selector: 'app-check-your-numbers',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './check-your-numbers.component.html',
  styleUrls: ['./check-your-numbers.component.scss']
})
export class CheckYourNumbersComponent implements OnChanges {
  @Input() lotteryIds: Array<string>;
  @Input() lotteriesMap: LotteriesMapInterface;

  @Output() goToRoute: EventEmitter<string> = new EventEmitter<string>();

  // ng-select
  optionsList: Array<IOption> = [];

  constructor(private analyticsDeprecatedService: AnalyticsDeprecatedService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.lotteryIds && changes.lotteryIds.currentValue) {
      this.lotteryIds.map((lotteryId) => {
        this.optionsList.push({
          value: lotteryId,
          label: this.lotteriesMap[lotteryId].name
        });
      });
    }
  }

  onTrackCheckNumber(lotteryId: any) {
    if (lotteryId) {
      this.analyticsDeprecatedService.trackResultsCheckerClicked(this.lotteriesMap[lotteryId].name);
    } else {
      this.analyticsDeprecatedService.trackResultsCheckerClicked('results');
    }
  }
}
