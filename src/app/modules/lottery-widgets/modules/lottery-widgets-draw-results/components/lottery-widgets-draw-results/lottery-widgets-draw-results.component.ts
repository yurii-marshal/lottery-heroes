import { ChangeDetectionStrategy, Component, Inject, Input, OnInit } from '@angular/core';

import { DrawInterface } from '../../../../../api/entities/incoming/lotteries/draws.interface';
import { LotteryInterface } from '../../../../../api/entities/incoming/lotteries/lotteries.interface';
import { BrandQueryService } from 'app/upgraded/libs/biglotteryowin-core/services/queries/brand-query.service';
import { LOTTERY_WIDGETS_DRAW_RESULTS_CONFIG } from '../../configs/lottery-widgets-draw-results.config';

@Component({
  selector: 'app-lottery-widgets-draw-results',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lottery-widgets-draw-results.component.html',
  styleUrls: ['./lottery-widgets-draw-results.component.scss']
})
export class LotteryWidgetsDrawResultsComponent implements OnInit {
  @Input() lastDraws: Array<DrawInterface>;
  @Input() lottery: LotteryInterface;

  visibleLines = 2; // number of visible lines, starting from 0(zero)
  config: { [key: string]: any };

  constructor(@Inject(LOTTERY_WIDGETS_DRAW_RESULTS_CONFIG) private lotteryWidgetsDrawResultsConfig: {[brandId: string]: object},
              private brandQueryService: BrandQueryService) {}

  ngOnInit(): void {
    const brandId = this.brandQueryService.getBrandId();
    this.config = this.lotteryWidgetsDrawResultsConfig[brandId];
  }
}
