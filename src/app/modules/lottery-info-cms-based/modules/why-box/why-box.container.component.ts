import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LotteryInterface } from '../../../api/entities/incoming/lotteries/lotteries.interface';

@Component({
  selector: 'app-why-box-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-why-box
      [lottery]="lottery"
      [cms]="cms"
    ></app-why-box>
  `
})
export class WhyBoxContainerComponent {
  @Input() lottery: LotteryInterface;
  @Input() cms: any;
}
