import { Component, Input } from '@angular/core';
import { AnalyticsDeprecatedService } from '../../../../analytics-deprecated/services/analytics-deprecated.service';
import { ComboItemModel } from '../../../../../models/combo.model';

@Component({
  selector: 'app-combos-menu-list',
  templateUrl: './combos-menu-list.component.html',
  styleUrls: ['./combos-menu-list.component.scss']
})
export class CombosMenuListComponent {
  @Input() combosList: Array<ComboItemModel>;

  constructor(private analyticsDeprecatedService: AnalyticsDeprecatedService) {}

  onTrackNavigationClicked(label: string) {
    this.analyticsDeprecatedService.trackNavigationClicked(label);
  }
}
