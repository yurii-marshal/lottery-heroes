import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {DeviceType} from '../../../../../../services/device/entities/types/device.type';
import {BundleItemModel} from '../../../../../../models/bundle.model';

@Component({
  selector: 'app-top-bundles',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './top-bundles.component.html',
  styleUrls: ['./top-bundles.component.scss']
})
export class TopBundlesComponent {
  @Input() bundlesList: Array<BundleItemModel>;
  @Input() device: DeviceType;

  @Output() addToCart = new EventEmitter();
}
