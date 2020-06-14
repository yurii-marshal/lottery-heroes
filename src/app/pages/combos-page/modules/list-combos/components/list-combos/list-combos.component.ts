import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DeviceType } from '../../../../../../services/device/entities/types/device.type';
import { ComboItemModel } from '../../../../../../models/combo.model';

@Component({
  selector: 'app-list-combos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './list-combos.component.html',
  styleUrls: ['./list-combos.component.scss']
})
export class ListCombosComponent {
  @Input() combosList: Array<ComboItemModel>;
  @Input() device: DeviceType;

  @Output() addToCart = new EventEmitter();
}
