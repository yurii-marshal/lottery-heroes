import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BundleItemModel} from '../../../../../models/bundle.model';

@Component({
  selector: 'app-bundles-menu-list-item-mobile',
  templateUrl: './bundles-menu-list-item-mobile.component.html',
  styleUrls: ['./bundles-menu-list-item-mobile.component.scss']
})
export class BundlesMenuListItemMobileComponent {
  @Input() bundle: BundleItemModel;
  @Output() addToCart = new EventEmitter();
}
