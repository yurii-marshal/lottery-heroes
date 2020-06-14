import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { LotteryBrandInterface, LotteryInterface } from '../../../../api/entities/incoming/lotteries/lotteries.interface';
import { LotteriesService } from '../../../../../services/lotteries/lotteries.service';

@Component({
  selector: 'app-lottery-with-greatest-jackpot',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lottery-with-greatest-jackpot.component.html',
  styleUrls: ['./lottery-with-greatest-jackpot.component.scss']
})
export class LotteryWithGreatestJackpotComponent implements OnChanges {
  @Input() lottery: LotteryInterface;

  @Output() oTrackSuperJackpotLotteryClicked = new EventEmitter<string>();

  lotterySlug: string;

  constructor(private lotteriesService: LotteriesService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.lottery && changes.lottery.currentValue) {
      this.lotterySlug = this.lotteriesService.getSlugByLottery(this.lottery);
    }
  }
}
