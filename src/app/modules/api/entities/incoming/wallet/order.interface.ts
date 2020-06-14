export interface OrderInterface {
  cid: number;
  created_at: Date;
  customer_base_amount: number;
  customer_currency_id: string;
  customer_discount_amount: number;
  customer_total_amount: number;
  id: number;
  lines_json: string;
  note: any;
  status: string;
  system_base_amount: number;
  system_currency_id: string;
  system_discount_amount: number;
  system_total_amount: number;
  updated_at: Date;
}
