import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CartComboItemModel } from '../../../../models/cart/cart-combo-item.model';
import { ComboItemModel } from '../../../../models/combo.model';
import { CombosService } from '../../../../services/combos/combos.service';
import { Cart2ComboService } from '../../../../services/cart2/cart2-combo.service';

@Component({
  selector: 'app-main-combo-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-main-combo
      *ngIf="combo !== null"
      [combo]="combo"
      (addToCart)="addToCart($event)"
    ></app-main-combo>`
})
export class MainComboContainerComponent {
  @Input() combo: ComboItemModel;

  constructor(private combosService: CombosService,
              private cart2ComboService: Cart2ComboService,
              private router: Router) {
  }

  addToCart(combo) {
    const addItems = [];
    const lines = this.cart2ComboService.generateLines(combo);
    const shares = this.cart2ComboService.generateShares(combo);
    const item = new CartComboItemModel(combo.id, lines, shares);
    addItems.push(item);

    this.cart2ComboService.addItems(addItems);
    this.router.navigate(['/cart']);
  }
}
