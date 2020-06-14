import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Cart2Service } from '../../../../services/cart2/cart2.service';
import { WalletService } from '../../../../services/wallet.service';
import { AnalyticsDeprecatedService } from '../../../analytics-deprecated/services/analytics-deprecated.service';
import { CurrencyService } from '../../../../services/auth/currency.service';

import { BalanceInterface } from '../../../../services/api/entities/incoming/wallet/balance.interface';
import { OfferingsTotalPriceInterface } from '../../../api/entities/incoming/offerings/offerings-total-price.interface';
import { CartItemModel } from '../../../../models/cart/cart-item.model';

@Component({
  selector: 'app-cart-menu-list-container',
  template: `
    <app-cart-menu-list
      [items]="items$|async"
      [siteCurrencySymbol]="siteCurrencySymbol$|async"
      [totalPrice]="totalPrice$|async"
      [balance]="balance$|async"

      (deleteItemEvent)="onDeleteItemEvent($event)"
    ></app-cart-menu-list>

    <!--- Remove confirmation --->
    <app-confirmation-remove-item
      *ngIf="removedItem"

      [item]="removedItem"

      (approveRemoveConfirmation)="onApproveRemoveConfirmationEvent($event)"
      (closeRemoveConfirmation)="onCloseRemoveConfirmationEvent()"
      (keepForLuckPressed)="onKeepForLuckPressedEvent()"
    >
    </app-confirmation-remove-item>
  `
})
export class CartMenuListContainerComponent implements OnInit {
  items$: Observable<CartItemModel[]>;
  siteCurrencySymbol$: Observable<string>;
  totalPrice$: Observable<number>;
  balance$: Observable<BalanceInterface>;
  removedItem: CartItemModel | null = null;

  constructor(private cart2Service: Cart2Service,
              private currencyService: CurrencyService,
              private walletService: WalletService,
              private analyticsDeprecatedService: AnalyticsDeprecatedService) {
  }

  ngOnInit(): void {
    this.items$ = this.cart2Service.getItems$();
    this.siteCurrencySymbol$ = this.currencyService.getCurrencySymbol();
    this.totalPrice$ = this.cart2Service.getTotalPriceWithDiscount$()
      .map((totalPrice: OfferingsTotalPriceInterface) => {
        return totalPrice.customer_total_amount;
      });
    this.balance$ = this.walletService.getCustomerBalance();
  }

  onDeleteItemEvent(item: CartItemModel): void {
    this.removedItem = item;
    this.analyticsDeprecatedService.trackTrashIconClicked('order');
  }

  onApproveRemoveConfirmationEvent(item: CartItemModel) {
    this.cart2Service.deleteItems([item.id]);
    this.removedItem = null;
    this.analyticsDeprecatedService.trackCartRemoveFromCartClick(item);
  }

  onCloseRemoveConfirmationEvent(): void {
    this.removedItem = null;
  }

  onKeepForLuckPressedEvent(): void {
    this.analyticsDeprecatedService.trackCartInteractionClick('keep for luck');
  }
}
