import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { LotteriesItemModel } from '../../models/lotteries-item.model';

@Component({
  selector: 'app-lotteries-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lotteries-item.component.html',
  styleUrls: ['./lotteries-item.component.scss'],
})
export class LotteriesItemComponent {
  @Input() item: LotteriesItemModel;

  @Output() addToCartEvent = new EventEmitter<{lotteryId: string, linesNumber: number}>();
}
