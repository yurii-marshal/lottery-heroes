import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {Cart2BundleService} from '../../../../services/cart2/cart2-bundle.service';
import {BundlesService} from '../../../../services/bundles/bundles.service';
import {BundleItemModel} from '../../../../models/bundle.model';
import {CartBundleItemModel} from '../../../../models/cart/cart-bundle-item.model';

@Component({
  selector: 'app-main-bundle-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-main-bundle
      *ngIf="bundle !== null"
      [bundle]="bundle"
      (addToCart)="addToCart($event)"
    ></app-main-bundle>`
})
export class MainBundleContainerComponent {
  @Input() bundle: BundleItemModel;

  constructor(private bundlesService: BundlesService,
              private cart2BundleService: Cart2BundleService,
              private router: Router) {
  }

  addToCart(bundle) {
    const addItems = [];
    const lines = this.cart2BundleService.generateLines(bundle);
    const shares = this.cart2BundleService.generateShares(bundle);
    const item = new CartBundleItemModel(bundle.id, lines, shares);
    addItems.push(item);

    this.cart2BundleService.addItems(addItems);
    this.router.navigate(['/cart']);
  }
}
