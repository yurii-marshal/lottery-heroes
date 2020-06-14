import { BallCombinationsMapInterface } from './ball-combinations-map.interface';

export interface LotteryDrawsScheduleInterface {
  weekday: number;
  local_time: string;
}

export interface LotteryBrandInterface {
  id: string;
  date_started: string;
  is_sold: boolean;
  custom_country: string;
  custom_country_short: string;
  popularity: number;
  url_slug: string;
  lotid: string;
}

export interface LotteryRulesItemInterface {
  lowest: number;
  highest: number;
  picks: number;
  name: string;
  in_results_only?: boolean;
}

export interface LotteryRulesInterface {
  max_lines: number;
  min_lines: number;
  even_lines_only: boolean;
  main_numbers: LotteryRulesItemInterface;
  extra_numbers: LotteryRulesItemInterface | null;
  perticket_numbers: LotteryRulesItemInterface | null;
  num_lines_multiple_of: number;
}

export interface LotteryStatsInterface {
  hot_numbers: Array<number>;
  cold_numbers: Array<number>;
}

export interface LotteryInterface {
  id: string;
  min_prize: number;
  brands: Array<LotteryBrandInterface>;
  logo: string;
  logo_wide: string; // only on frontend
  currency_id: string;
  draws_timezone: string;
  draws_per_week: number;
  draws_schedule: Array<LotteryDrawsScheduleInterface>;
  name: string;
  draws_per_ticket: Array<number>;
  country_id: string;
  rules: LotteryRulesInterface;
  stats: LotteryStatsInterface;
  odds: BallCombinationsMapInterface;
  rank_associations: LotteryOddsRankAssoc | null;
}

export interface LotteriesInterface {
  lotteries: Array<LotteryInterface>;
}

export interface LotteriesPopularityInterface {
  id: string;
  popularity: number;
}

export interface LotteryOddsRankAssoc {
  [key: string]: string[]; // 'm1_x2': ['m2_x2', 'm3_x1']
}
