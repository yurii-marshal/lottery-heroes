import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LotteryBrandInterface, LotteryInterface } from '../../../../api/entities/incoming/lotteries/lotteries.interface';
import { DrawInterface } from '../../../../api/entities/incoming/lotteries/draws.interface';
import { BrandQueryService } from '@libs/biglotteryowin-core/services/queries/brand-query.service';
import { LotteriesService } from '../../../../../services/lotteries/lotteries.service';

@Component({
  selector: 'app-results-menu-list-item-mobile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './results-menu-list-item-mobile.component.html',
  styleUrls: ['./results-menu-list-item-mobile.component.scss'],
})
export class ResultsMenuListItemMobileComponent implements OnChanges {
  @Input() lottery: LotteryInterface;
  @Input() latestDraw: DrawInterface;

  lotterySlug: string;

  constructor(private lotteriesService: LotteriesService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.lottery && changes.lottery.currentValue) {
      this.lotterySlug = this.lotteriesService.getSlugByLottery(this.lottery);
    }
  }
}
