export interface GetSyndicatesDto {
  syndicates: SyndicateDto[];
}

export interface SyndicateDto {
  template_id: number;
  lottery_id: string;
  num_shares: number;
  num_lines: number;
  prices: Array<{
    currency_id: string;
    share_price: number;
  }>;
  num_shares_available: number;
  cutoff_time: string;
  stop_sell_time: string;
  draw_id: number;
  draw_date: string;
  lines: Array<{
    main_numbers: number[];
    extra_numbers: number[];
    perticket_numbers: number[];
  }>;
}
