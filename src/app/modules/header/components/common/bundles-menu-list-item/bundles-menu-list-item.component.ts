import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BundleItemModel} from '../../../../../models/bundle.model';

@Component({
  selector: 'app-bundles-menu-list-item',
  templateUrl: './bundles-menu-list-item.component.html',
  styleUrls: ['./bundles-menu-list-item.component.scss']
})
export class BundlesMenuListItemComponent {
  @Input() bundle: BundleItemModel;
  @Output() addToCart = new EventEmitter();
}
