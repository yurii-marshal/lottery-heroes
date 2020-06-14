export interface LuvBrandInterface {
  id: string; // "BIGLOTTERYOWIN_COM"
  name: string; // "BIGLOTTERYOWIN"
  currency_id: string; // "EUR"
}

export interface LuvBrandsInterface {
  brands: Array<LuvBrandInterface>;
}
