import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { LotteriesService } from '../../../../../services/lotteries/lotteries.service';
import { AnalyticsDeprecatedService } from '../../../../../modules/analytics-deprecated/services/analytics-deprecated.service';
import { LotteryInterface } from '../../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { DrawInterface } from '../../../../../modules/api/entities/incoming/lotteries/draws.interface';
import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';

@Component({
  selector: 'app-results-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './results-item.component.html',
  styleUrls: ['./results-item.component.scss'],
})
export class ResultsItemComponent implements OnInit, OnChanges {
  @Input() position: number;
  @Input() lottery: LotteryInterface;
  @Input() latestDraw: DrawInterface;
  @Input() lotteryCountryName: string;
  @Input() syndicate: SyndicateModel;

  showToday = false;
  showYesterday = false;
  showDay = false;
  lotterySlug: string;

  constructor(private lotteriesService: LotteriesService,
              private analyticsDeprecatedService: AnalyticsDeprecatedService) {
  }

  ngOnInit() {
    this.setDateDetails();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.lottery && changes.lottery.currentValue) {
      this.lotterySlug = this.lotteriesService.getSlugByLottery(this.lottery);
    }
  }

  setDateDetails() {
    const today = new Date();
    const currentDate = new Date(today.getFullYear() + '-' + '0' + (today.getMonth() + 1) + '-' + today.getDate());
    const drawDate = new Date(this.latestDraw.date_local);
    const time = currentDate.getTime() - drawDate.getTime();

    if (time <= 86400000 * 6) {
      if (time === 0) {
        this.showToday = true;
      } else if (time === 86400000) {
        this.showYesterday = true;
      } else {
        this.showDay = true;
      }
    }
  }

  setItempropAttr() {
    return this.lottery.id === 'euromillions' || this.lottery.id === 'euromillions-ie' ||
      this.lottery.id === 'powerball' || this.lottery.id === 'megamillions' ||
      this.lottery.id === 'lotto-uk' ? 'significantLink' : null;
  }

  isShowLogoLink(): boolean {
    return this.lotteriesService.hasSoldBrand(this.lottery.brands) || (this.syndicate && typeof this.syndicate !== 'undefined');
  }

  onTrackSeeAllResultsClicked(lotteryName: string) {
    this.analyticsDeprecatedService.trackSeeAllResultsClicked(lotteryName);
  }
}
