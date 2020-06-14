import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComboItemLotteryModel } from '../../../../services/combos/entities/combos-lottery.interface';

@Component({
  selector: 'app-combo-lotteries',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './combo-lotteries.component.html',
  styleUrls: ['./combo-lotteries.component.scss']
})
export class ComboLotteriesComponent {
  @Input() lottery: ComboItemLotteryModel;
  @Input() currency: string;
}
