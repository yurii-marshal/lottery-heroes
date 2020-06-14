import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ComboItemModel } from '../../../../../../models/combo.model';
import { DeviceType } from '../../../../../../services/device/entities/types/device.type';

@Component({
  selector: 'app-top-combos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './top-combos.component.html',
  styleUrls: ['./top-combos.component.scss']
})
export class TopCombosComponent {
  @Input() combosList: Array<ComboItemModel>;
  @Input() device: DeviceType;

  @Output() addToCart = new EventEmitter();
}
