import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CartLotteryItemModel } from '../../../../../../models/cart/cart-lottery-item.model';
import { LotteryInterface } from '../../../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { LineInterface } from '../../../../../../modules/api/entities/outgoing/common/line.interface';

@Component({
  selector: 'app-notification-multiples-lines',
  templateUrl: './notification-multiples-lines.component.html',
  styleUrls: ['./notification-multiples-lines.component.scss']
})
export class NotificationMultiplesLinesComponent implements OnChanges {
  @Input() item: CartLotteryItemModel;
  @Input() lottery: LotteryInterface;

  @Output() close = new EventEmitter<void>();

  nonFreeLines: Array<LineInterface>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item']) {
      this.nonFreeLines = this.item.lines.filter((line: LineInterface) => !line.isFree);
    }
  }
}
