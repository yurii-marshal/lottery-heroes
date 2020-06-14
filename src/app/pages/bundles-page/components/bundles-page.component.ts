import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {BundleItemModel} from '../../../models/bundle.model';

@Component({
  selector: 'app-bundles-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bundles-page.component.html',
  styleUrls: ['./bundles-page.component.scss']
})
export class BundlesPageComponent {
  @Input() mainBundle: BundleItemModel;
  @Input() topBundles: Array<BundleItemModel>;
  @Input() otherBundles: Array<BundleItemModel>;
}
