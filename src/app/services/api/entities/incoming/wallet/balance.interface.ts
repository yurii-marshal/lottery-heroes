export interface BalanceInterface {
  created_at: string;
  customer_bonus: number;
  customer_currency_id: string;
  customer_life_time_deposit: number;
  customer_life_time_turnover: number;
  customer_life_time_value: number;
  customer_total: number;
  customer_withdrawable: number;
  system_bonus: number;
  system_currency_id: string;
  system_life_time_deposit: number;
  system_life_time_turnover: number;
  system_life_time_value: number;
  system_total: number;
  system_withdrawable: number;
  updated_at: string;
}

export interface BalanceResponseInterface {
  balance: BalanceInterface;
}
