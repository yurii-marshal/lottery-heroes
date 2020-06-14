import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { LotteriesService } from '../../../../../services/lotteries/lotteries.service';

import { LotteryInterface } from '../../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { DrawInterface } from '../../../../../modules/api/entities/incoming/lotteries/draws.interface';
import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';

@Component({
  selector: 'app-results-draw-next-draw',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './results-draw-next-draw.component.html',
  styleUrls: ['./results-draw-next-draw.component.scss']
})
export class ResultsDrawNextDrawComponent implements OnChanges {
  @Input() upcomingDraw: DrawInterface;
  @Input() lottery: LotteryInterface;
  @Input() syndicate: SyndicateModel;

  lotterySlug: string;

  constructor(private lotteriesService: LotteriesService) {
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
}
