import {Component, Input} from '@angular/core';
import {AnalyticsDeprecatedService} from '../../../../analytics-deprecated/services/analytics-deprecated.service';
import {BundleItemModel} from '../../../../../models/bundle.model';

@Component({
  selector: 'app-bundles-menu-list',
  templateUrl: './bundles-menu-list.component.html',
  styleUrls: ['./bundles-menu-list.component.scss']
})
export class BundlesMenuListComponent {
  @Input() bundlesList: Array<BundleItemModel>;

  constructor(private analyticsDeprecatedService: AnalyticsDeprecatedService) {
  }

  onTrackNavigationClicked(label: string) {
    this.analyticsDeprecatedService.trackNavigationClicked(label);
  }
}
