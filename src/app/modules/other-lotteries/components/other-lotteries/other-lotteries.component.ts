import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { LotteryInterface } from '../../../api/entities/incoming/lotteries/lotteries.interface';
import { LotteriesService } from '../../../../services/lotteries/lotteries.service';

@Component({
  selector: 'app-other-lotteries',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './other-lotteries.component.html',
  styleUrls: ['./other-lotteries.component.scss']
})
export class OtherLotteriesComponent {
  @Input() popularLotteries: LotteryInterface[];
  @Input() previousLottery: LotteryInterface;
  @Input() nextLottery: LotteryInterface;

  @Output() linkClickEvent = new EventEmitter<string>();

  constructor(private lotteriesService: LotteriesService) {}

  getLotterySlug(lottery: LotteryInterface) {
    return this.lotteriesService.getSlugByLottery(lottery);
  }
}
