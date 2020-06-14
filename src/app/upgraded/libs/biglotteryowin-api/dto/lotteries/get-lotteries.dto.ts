export interface GetLotteriesDto {
  lotteries: LotteryDto[];
}

export interface LotteryDto {
  brands: Array<{
    custom_country: null;
    custom_country_short: string | null;
    date_started: string;
    id: string;
    is_sold: boolean;
    lotid: number;
    popularity: number;
    url_slug: string;
  }>;
  id: string;
  is_active: boolean;
  name: string;
  country_id: string;
  currency_id: string;
  draws_per_ticket: number[];
  draws_per_week: number;
  draws_schedule: Array<{
    local_cutoff_time: string;
    local_time: string;
    weekday: number;
  }>;
  draws_timezone: string;
  draws_to_predict: number;
  jackpot_alert_threshold_amount: number;
  jackpot_alert_threshold_currency_id: string;
  min_prize: number;
  odds: {[key: string]: number};
  rules: {
    main_numbers: {
      highest: number;
      lowest: number;
      picks: number;
    };
    extra_numbers?: {
      highest: number;
      lowest: number;
      picks: number;
      in_results_only: boolean;
    };
    perticket_numbers?: {
      highest: number;
      lowest: number;
      picks: number;
      name: string;
    };
    max_lines: number;
    min_lines: number;
    even_lines_only: boolean;
    num_lines_multiple_of: number;
  };
  stats: {
    cold_numbers: number[];
    hot_numbers: number[];
  };
}
