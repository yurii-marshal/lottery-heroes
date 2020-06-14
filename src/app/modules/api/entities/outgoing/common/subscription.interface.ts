import {LineInterface} from './line.interface';
import {ComboInterface} from './combo.interface';
import {BundleInterface} from './bundle.interface';

export interface SubscriptionInterface {
  renew_period: string;
  lines?: Array<LineInterface>;
  combos?: Array<ComboInterface>;
  bundles?: Array<BundleInterface>;
}
