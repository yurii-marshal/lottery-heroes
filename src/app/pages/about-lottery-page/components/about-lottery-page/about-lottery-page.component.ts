import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input } from '@angular/core';
import { AboutLotteryPageCmsInterface } from '../../entities/about-lottery-page-cms.interface';

@Component({
  selector: 'app-about-lottery-page-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-lottery-page.component.html',
  styleUrls: ['./about-lottery-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AboutLotteryPageComponent {
  @Input() cms: AboutLotteryPageCmsInterface;
  @Input() lotteryId: string;
}
