import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CartItemModel } from '../../../../models/cart/cart-item.model';

@Component({
  selector: 'app-confirmation-remove-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './confirmation-remove-item.component.html',
  styleUrls: ['./confirmation-remove-item.component.scss'],
})
export class ConfirmationRemoveItemComponent {
  @Input() item: CartItemModel;

  @Output() approveRemoveConfirmation = new EventEmitter<CartItemModel>();
  @Output() closeRemoveConfirmation = new EventEmitter();
  @Output() keepForLuckPressed = new EventEmitter();
}
