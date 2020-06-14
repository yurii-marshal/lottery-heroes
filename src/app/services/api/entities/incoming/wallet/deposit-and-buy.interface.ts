import { ComboInterface } from '../../../../../modules/api/entities/outgoing/common/combo.interface';
import { SubscriptionInterface } from '../../../../../modules/api/entities/outgoing/common/subscription.interface';
import { LineInterface } from '../../../../../modules/api/entities/outgoing/common/line.interface';
import { SyndicateInterface } from '../../../../../modules/api/entities/outgoing/common/syndicate.interface';
import {BundleInterface} from '../../../../../modules/api/entities/outgoing/common/bundle.interface';

export interface DepositAndBuyInterface {
  total_amount?: number;
  discount_amount?: number;
  deposit_amount?: number;
  lines?: Array<LineInterface>;
  combos?: Array<ComboInterface>;
  bundles?: Array<BundleInterface>;
  subscriptions?: Array<SubscriptionInterface>;
  shares?: Array<SyndicateInterface>;
}
