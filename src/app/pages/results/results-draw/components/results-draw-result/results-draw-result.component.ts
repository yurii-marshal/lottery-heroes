import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DeviceService } from '../../../../../services/device/device.service';
import { DeviceType } from '../../../../../services/device/entities/types/device.type';
import { DrawInterface } from '../../../../../modules/api/entities/incoming/lotteries/draws.interface';
import { LotteryInterface } from '../../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { LotteriesService } from '../../../../../services/lotteries/lotteries.service';

@Component({
  selector: 'app-results-draw-result',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './results-draw-result.component.html',
  styleUrls: ['./results-draw-result.component.scss']
})
export class ResultsDrawResultComponent implements OnInit, OnChanges {
  device$: Observable<DeviceType>;

  @Input() lottery: LotteryInterface;
  @Input() draw: DrawInterface;

  lotterySlug: string;

  constructor(private deviceService: DeviceService,
              private lotteriesService: LotteriesService) {
  }

  ngOnInit(): void {
    this.device$ = this.deviceService.getDevice();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.lottery && changes.lottery.currentValue) {
      this.lotterySlug = this.lotteriesService.getSlugByLottery(this.lottery);
    }
  }

  setItempropAttr() {
    return this.lottery.id === 'euromillions' || this.lottery.id === 'euromillions-ie' ||
      this.lottery.id === 'powerball' || this.lottery.id === 'megamillions' ||
      this.lottery.id === 'lotto-uk' ? 'significantLink' : null;
  }
}
