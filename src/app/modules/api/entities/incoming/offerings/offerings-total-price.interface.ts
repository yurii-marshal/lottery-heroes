import { LineInterface } from '../../outgoing/common/line.interface';

export interface OfferingsTotalPriceLineInterface extends LineInterface {
  system_amount: number;
  system_discount_amount: number;
  customer_amount: number;
  customer_discount_amount: number;
  applied_offer_ids: Array<number>;
}

export interface OfferingsTotalPriceInterface {
  system_currency_id: string;
  system_total_amount: number;
  system_discount_amount: number;
  system_original_amount: string;

  customer_currency_id: string;
  customer_total_amount: number;
  customer_discount_amount: number;
  customer_original_amount: number;

  lines: Array<OfferingsTotalPriceLineInterface>;
  subscriptions: Array<any>;
}
