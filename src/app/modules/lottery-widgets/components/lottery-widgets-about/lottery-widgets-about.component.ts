import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { ScrollService } from '../../../../services/device/scroll.service';
import { LotteryInterface } from '../../../api/entities/incoming/lotteries/lotteries.interface';

@Component({
  selector: 'app-lottery-widgets-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lottery-widgets-about.component.html',
  styleUrls: ['./lottery-widgets-about.component.scss']
})
export class LotteryWidgetsAboutComponent {
  @Input() lottery: LotteryInterface;

  constructor(private scrollService: ScrollService) {
  }

  toTop() {
    this.scrollService.toTop();
  }
}
