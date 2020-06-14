import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { LotteryInterface } from '../../../api/entities/incoming/lotteries/lotteries.interface';

@Component({
  selector: 'app-lottery-widgets-seo-description',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lottery-widgets-seo-description.component.html',
  styleUrls: ['./lottery-widgets-seo-description.component.scss']
})
export class LotteryWidgetsSeoDescriptionComponent {
  @Input() lottery: LotteryInterface;
}
