import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LotteryItemModel } from '../lottery-item.model';

@Component({
  selector: 'app-lottery-widget-similar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lottery-widget-similar.component.html',
  styleUrls: ['./lottery-widget-similar.component.scss']
})
export class LotteryWidgetSimilarComponent {
  @Input() items: Array<LotteryItemModel>;
}
