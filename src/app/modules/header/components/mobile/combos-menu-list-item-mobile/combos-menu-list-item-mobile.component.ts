import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComboItemModel } from '../../../../../models/combo.model';

@Component({
  selector: 'app-combos-menu-list-item-mobile',
  templateUrl: './combos-menu-list-item-mobile.component.html',
  styleUrls: ['./combos-menu-list-item-mobile.component.scss']
})
export class CombosMenuListItemMobileComponent {
  @Input() combo: ComboItemModel;
  @Output() addToCart = new EventEmitter();
}
