export interface LuvBrandInterface {
  id: string; // "BIGLOTTERYOWIN_UK"
  name: string; // "Biglotteryowin United Kingdom"
  currency_id: string; // "GBP"
}

export interface LuvBrandsInterface {
  brands: Array<LuvBrandInterface>;
}
