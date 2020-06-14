import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {BundleItemLotteryModel} from '../../../../services/bundles/entities/bundles-lottery.interface';

@Component({
  selector: 'app-bundle-lotteries',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bundle-lotteries.component.html',
  styleUrls: ['./bundle-lotteries.component.scss']
})
export class BundleLotteriesComponent {
  @Input() lottery: BundleItemLotteryModel;
  @Input() currency: string;
}
