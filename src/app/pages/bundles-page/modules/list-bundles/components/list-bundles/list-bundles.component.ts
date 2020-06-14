import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {DeviceType} from '../../../../../../services/device/entities/types/device.type';
import {BundleItemModel} from '../../../../../../models/bundle.model';

@Component({
  selector: 'app-list-bundles',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './list-bundles.component.html',
  styleUrls: ['./list-bundles.component.scss']
})
export class ListBundlesComponent {
  @Input() bundlesList: Array<BundleItemModel>;
  @Input() device: DeviceType;

  @Output() addToCart = new EventEmitter();
}
