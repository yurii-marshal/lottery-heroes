import { Component, ChangeDetectionStrategy, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { LotteriesService } from '../../../../../services/lotteries/lotteries.service';
import { DeviceService } from '../../../../../services/device/device.service';
import { DeviceType } from '../../../../../services/device/entities/types/device.type';
import { LotteryInterface } from '../../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { SyndicatesQueryService } from '@libs/biglotteryowin-core/services/queries/syndicates-query.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-results-lottery-info',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './results-lottery-info.component.html',
  styleUrls: ['./results-lottery-info.component.scss']
})
export class ResultsLotteryInfoComponent implements OnInit, OnChanges {
  @Input() lottery: LotteryInterface;

  device$: Observable<DeviceType>;
  isShowLogoLink$: Observable<boolean>;
  lotterySlug: string;

  constructor(private lotteriesService: LotteriesService,
              private deviceService: DeviceService,
              private syndicateQueryService: SyndicatesQueryService) {
  }

  ngOnInit(): void {
    this.device$ = this.deviceService.getDevice();
    this.isShowLogoLink$ = this.isShowLogoLink();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lottery'] && changes['lottery'].currentValue) {
      this.lotterySlug = this.lotteriesService.getSlugByLottery(this.lottery);
    }
  }

  private isShowLogoLink(): Observable<boolean> {
    return this.syndicateQueryService.getSyndicateModelByLotteryId(this.lottery.id)
      .pipe(
        map(syndicateModel => {
          return !!syndicateModel || this.lotteriesService.hasSoldBrand(this.lottery.brands);
        })
      );
  }

  setItempropAttr() {
    return this.lottery.id === 'euromillions' || this.lottery.id === 'euromillions-ie' ||
    this.lottery.id === 'powerball' || this.lottery.id === 'megamillions' ||
    this.lottery.id === 'lotto-uk' ? 'significantLink' : null;
  }
}
