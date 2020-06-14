export interface LuvCurrencyRateInterface {
  id: string; // "USD"
  rate: number; // ":0.616703"
}

export interface LuvCurrencyRatesInterface {
  currency_rates: Array<LuvCurrencyRateInterface>;
}
