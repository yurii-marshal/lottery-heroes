export interface PriceInterface {
  draw_id: number | null;
  base_line_price: number;
  base_currency_id: string;
}

export interface OfferingsPricesMapInterface {
  [lotteryId: string]: {
    prices: Array<PriceInterface>;
  };
}

export interface OfferingsPricesInterface {
  prices: OfferingsPricesMapInterface;
}
