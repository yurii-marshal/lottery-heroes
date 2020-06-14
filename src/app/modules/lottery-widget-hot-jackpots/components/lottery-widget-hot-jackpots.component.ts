import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LotteryItemModel } from '../lottery-item.model';

@Component({
  selector: 'app-lottery-widget-hot-jackpots',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lottery-widget-hot-jackpots.component.html',
  styleUrls: ['./lottery-widget-hot-jackpots.component.scss']
})
export class LotteryWidgetHotJackpotsComponent {
  @Input() items: Array<LotteryItemModel>;
}
