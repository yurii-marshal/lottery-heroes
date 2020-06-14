import {Component, Input} from '@angular/core';
import {SyndicateModel} from '@libs/biglotteryowin-core/models/syndicate.model';

@Component({
  selector: 'app-cart-item-bundle-syndicate',
  templateUrl: './cart-item-bundle-syndicate.component.html',
  styleUrls: ['./cart-item-bundle-syndicate.component.scss']
})
export class CartItemBundleSyndicateComponent {
  @Input() syndicate: SyndicateModel;
  @Input() share: { template_id: number, num_shares: number };
}
