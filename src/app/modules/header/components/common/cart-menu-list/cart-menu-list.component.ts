import { Component, Input, Output, EventEmitter } from '@angular/core';

import { BalanceInterface } from '../../../../../services/api/entities/incoming/wallet/balance.interface';
import { AnalyticsDeprecatedService } from '../../../../analytics-deprecated/services/analytics-deprecated.service';
import { CartItemModel } from '../../../../../models/cart/cart-item.model';

@Component({
  selector: 'app-cart-menu-list',
  templateUrl: './cart-menu-list.component.html',
  styleUrls: ['./cart-menu-list.component.scss']
})
export class CartMenuListComponent {
  @Input() items: Array<CartItemModel>;
  @Input() siteCurrencySymbol: string;
  @Input() totalPrice: number;
  @Input() balance: BalanceInterface;

  @Output() deleteItemEvent = new EventEmitter<CartItemModel>();

  constructor(private analyticsDeprecatedService: AnalyticsDeprecatedService) {
  }

  onTrackNavigationClicked(titleName: string) {
    this.analyticsDeprecatedService.trackNavigationClicked(titleName);
  }
}
