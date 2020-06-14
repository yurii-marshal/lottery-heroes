export interface GetPricesDto {
  prices: PricesMapDto;
}

export interface PricesMapDto {
  [lotteryId: string]: {
    prices: PriceDto[];
  };
}

export interface PriceDto {
  base_currency_id: string;
  base_line_price: number;
  draw_id: number | null;
}
