import { Component, ChangeDetectionStrategy, OnInit, Input } from '@angular/core';
import { ComboItemModel } from '../../../../models/combo.model';
import { CartComboItemModel } from '../../../../models/cart/cart-combo-item.model';
import { Cart2ComboService } from '../../../../services/cart2/cart2-combo.service';
import { Router } from '@angular/router';
import { LineInterface } from '../../../api/entities/outgoing/common/line.interface';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../store/reducers';
import * as headerActions from '../../actions/header.actions';

@Component({
  selector: 'app-combos-menu-list-item-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-combos-menu-list-item
      class="hidden-sm-down"
      [combo]="combo"
      (addToCart)="addToCart($event)"
    ></app-combos-menu-list-item>
    <app-combos-menu-list-item-mobile
      class="hidden-md-up"
      [combo]="combo"
      (addToCart)="addToCart($event)"
    ></app-combos-menu-list-item-mobile>
  `
})
export class CombosMenuListItemContainerComponent {
  @Input() combo: ComboItemModel;

  constructor(private cart2ComboService: Cart2ComboService,
              private router: Router,
              private store: Store<fromRoot.State>) {
  }

  addToCart(combo) {
    const addItems = [];
    const lines = this.cart2ComboService.generateLines(combo);
    const shares = this.cart2ComboService.generateShares(combo);
    const item = new CartComboItemModel(combo.id, lines, shares);
    addItems.push(item);

    this.cart2ComboService.addItems(addItems);
    this.store.dispatch(new headerActions.ClickSelectCombo({ comboName: combo.name }));
    this.router.navigate(['/cart']);
  }
}
