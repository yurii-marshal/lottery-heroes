import { Component, Input } from '@angular/core';
import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';

@Component({
  selector: 'app-cart-item-combo-syndicate',
  templateUrl: './cart-item-combo-syndicate.component.html',
  styleUrls: ['./cart-item-combo-syndicate.component.scss']
})
export class CartItemComboSyndicateComponent {
  @Input() syndicate: SyndicateModel;
  @Input() share: { template_id: number, num_shares: number};
}
