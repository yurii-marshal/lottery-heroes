import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartComboItemModel } from '../../../../../../models/cart/cart-combo-item.model';
import { LotteryInterface } from '../../../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { LineInterface } from '../../../../../../modules/api/entities/outgoing/common/line.interface';

@Component({
  selector: 'app-cart-item-combo-lottery',
  templateUrl: './cart-item-combo-lottery.component.html',
  styleUrls: ['./cart-item-combo-lottery.component.scss']
})
export class CartItemComboLotteryComponent {
  @Input() item: CartComboItemModel;
  @Input() lottery: LotteryInterface;
  @Input() lotteryLines: Array<LineInterface>;

  @Output() editLineEvent = new EventEmitter<{item: CartComboItemModel, editedLine: LineInterface}>();

  trackByLineId(index: number, line: LineInterface): string {
    return line.id;
  }

  getLineIndex(item: CartComboItemModel, editedLine: LineInterface): number {
    let lineIndex = 0;
    for (let i = 0; i < item.lines.length; i++) {
      if (item.lines[i].id === editedLine.id) {
        lineIndex = i + 1;
        break;
      }
    }
    return lineIndex;
  }
}
