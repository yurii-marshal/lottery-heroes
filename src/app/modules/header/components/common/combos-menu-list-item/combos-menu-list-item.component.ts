import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComboItemModel } from '../../../../../models/combo.model';

@Component({
  selector: 'app-combos-menu-list-item',
  templateUrl: './combos-menu-list-item.component.html',
  styleUrls: ['./combos-menu-list-item.component.scss']
})
export class CombosMenuListItemComponent {
  @Input() combo: ComboItemModel;
  @Output() addToCart = new EventEmitter();
}
