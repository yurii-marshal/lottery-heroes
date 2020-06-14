export interface LuvCurrencyInterface {
  id: string; // "USD"
  name: string; // "US Dollar"
  symbol: string; // "$"
}

export interface LuvCurrenciesInterface {
  currencies: Array<LuvCurrencyInterface>;
}
