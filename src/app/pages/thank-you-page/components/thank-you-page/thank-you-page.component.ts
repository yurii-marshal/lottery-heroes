import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ComboItemModel} from '../../../../models/combo.model';
import {CustomerInterface} from '../../../../services/auth/entities/interfaces/customer.interface';
import {CartStoreInterface} from '../../../../store/entities/cart-store.interface';
import {BundleItemModel} from '../../../../models/bundle.model';

@Component({
  selector: 'app-thank-you-page',
  templateUrl: './thank-you-page.component.html',
  styleUrls: ['./thank-you-page.component.scss']
})
export class ThankYouPageComponent implements OnChanges {
  @Input() lastOrdered: Array<CartStoreInterface | null>;
  @Input() combosList: Array<ComboItemModel>;
  @Input() bundlesList: Array<BundleItemModel>;
  @Input() customer: CustomerInterface;

  isMoreThanOneBet: boolean;
  isSyndicate: boolean;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lastOrdered'] && changes['lastOrdered'].currentValue !== null) {
      const lastOrdered = changes['lastOrdered'].currentValue;
      this.isMoreThanOneBet = lastOrdered.lines.length > 1
        || lastOrdered.combos.length > 0
        || lastOrdered.bundles.length > 0
        || lastOrdered.subscriptions.length > 0;

      this.isSyndicate = (lastOrdered.lines.length >= 0
        || lastOrdered.combos.length >= 0
        || lastOrdered.bundles.length >= 0
        || lastOrdered.subscriptions.length >= 0)
        && lastOrdered.shares.length > 0;
    }
  }
}
