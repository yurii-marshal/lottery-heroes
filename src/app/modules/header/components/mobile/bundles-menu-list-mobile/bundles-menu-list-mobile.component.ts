import { Component, Input } from '@angular/core';
import {BundleItemModel} from '../../../../../models/bundle.model';

@Component({
  selector: 'app-bundles-menu-list-mobile',
  templateUrl: './bundles-menu-list-mobile.component.html',
  styleUrls: ['./bundles-menu-list-mobile.component.scss']
})
export class BundlesMenuListMobileComponent {
  @Input() bundlesList: Array<BundleItemModel>;
}
