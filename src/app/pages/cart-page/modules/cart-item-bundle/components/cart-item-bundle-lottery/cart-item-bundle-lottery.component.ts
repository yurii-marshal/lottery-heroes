import {Component, EventEmitter, Input, Output} from '@angular/core';
import {LotteryInterface} from '../../../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import {LineInterface} from '../../../../../../modules/api/entities/outgoing/common/line.interface';
import {CartBundleItemModel} from '../../../../../../models/cart/cart-bundle-item.model';

@Component({
  selector: 'app-cart-item-bundle-lottery',
  templateUrl: './cart-item-bundle-lottery.component.html',
  styleUrls: ['./cart-item-bundle-lottery.component.scss']
})
export class CartItemBundleLotteryComponent {
  @Input() item: CartBundleItemModel;
  @Input() lottery: LotteryInterface;
  @Input() lotteryLines: Array<LineInterface>;

  @Output() editLineEvent = new EventEmitter<{ item: CartBundleItemModel, editedLine: LineInterface }>();

  trackByLineId(index: number, line: LineInterface): string {
    return line.id;
  }

  getLineIndex(item: CartBundleItemModel, editedLine: LineInterface): number {
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
