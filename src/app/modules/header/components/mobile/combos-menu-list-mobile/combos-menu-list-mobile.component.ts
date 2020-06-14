import { Component, Input } from '@angular/core';
import { ComboItemModel } from '../../../../../models/combo.model';

@Component({
  selector: 'app-combos-menu-list-mobile',
  templateUrl: './combos-menu-list-mobile.component.html',
  styleUrls: ['./combos-menu-list-mobile.component.scss']
})
export class CombosMenuListMobileComponent {
  @Input() combosList: Array<ComboItemModel>;
}
