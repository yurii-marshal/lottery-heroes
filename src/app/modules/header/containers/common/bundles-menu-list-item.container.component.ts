import { Component, ChangeDetectionStrategy, OnInit, Input } from '@angular/core';
import { ComboItemModel } from '../../../../models/combo.model';
import { CartComboItemModel } from '../../../../models/cart/cart-combo-item.model';
import { Cart2ComboService } from '../../../../services/cart2/cart2-combo.service';
import { Router } from '@angular/router';
import { LineInterface } from '../../../api/entities/outgoing/common/line.interface';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../store/reducers';
import * as headerActions from '../../actions/header.actions';
import {BundleItemModel} from '../../../../models/bundle.model';
import {Cart2BundleService} from '../../../../services/cart2/cart2-bundle.service';
import {CartBundleItemModel} from '../../../../models/cart/cart-bundle-item.model';

@Component({
  selector: 'app-bundles-menu-list-item-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-bundles-menu-list-item
      class="hidden-sm-down"
      [bundle]="bundle"
      (addToCart)="addToCart($event)"
    ></app-bundles-menu-list-item>
    <app-bundles-menu-list-item-mobile
      class="hidden-md-up"
      [bundle]="bundle"
      (addToCart)="addToCart($event)"
    ></app-bundles-menu-list-item-mobile>
  `
})
export class BundlesMenuListItemContainerComponent {
  @Input() bundle: BundleItemModel;

  constructor(private cart2BundleService: Cart2BundleService,
              private router: Router,
              private store: Store<fromRoot.State>) {
  }

  addToCart(bundle) {
    const addItems = [];
    const lines = this.cart2BundleService.generateLines(bundle);
    const shares = this.cart2BundleService.generateShares(bundle);
    const item = new CartBundleItemModel(bundle.id, lines, shares);
    addItems.push(item);

    this.cart2BundleService.addItems(addItems);
    this.store.dispatch(new headerActions.ClickSelectBundle({ bundleName: bundle.name }));
    this.router.navigate(['/cart']);
  }
}
