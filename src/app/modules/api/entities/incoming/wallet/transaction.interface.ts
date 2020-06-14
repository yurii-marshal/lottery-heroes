export interface TransactionInterface {
  id: number;
  status: string;
  customer_currency_id: string;
  customer_amount: number;
  system_currency_id: string;
  system_amount: number;
  transaction_currency_id: string;
  transaction_amount: number;
  note: any;
  external_transaction_id: any;
  external_response: any;
  promotion_code: any;
  iban: any;
  is_suspected_fraud: boolean;
  settled_line_id: any;
  payment_method_id: number;
  payment_sub_method_id: any;
  created_at: Date;
  updated_at: Date;
  order_id: number;
  transaction_type_id: number;
  type: {id: number; name: string; description: string};
}
