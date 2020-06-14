import { LineInterface } from './outgoing/common/line.interface';
import { ComboInterface } from './outgoing/common/combo.interface';
import { SubscriptionInterface } from './outgoing/common/subscription.interface';
import { SyndicateInterface } from './outgoing/common/syndicate.interface';
import {BundleInterface} from './outgoing/common/bundle.interface';

export interface CartItemsInterface {
  lines: LineInterface[];
  combos: ComboInterface[];
  bundles: BundleInterface[];
  subscriptions?: SubscriptionInterface[];
  shares?: SyndicateInterface[];
}
