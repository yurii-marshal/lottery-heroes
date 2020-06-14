import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { LotteryInterface } from '../../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { DrawInterface } from '../../../../../modules/api/entities/incoming/lotteries/draws.interface';

@Component({
  selector: 'app-results-draw-title',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './results-draw-title.component.html',
  styleUrls: ['./results-draw-title.component.scss']
})
export class ResultsDrawTitleComponent {
  @Input() lottery: LotteryInterface;
  @Input() draw: DrawInterface;
  @Input() dateFormated: string;
}
