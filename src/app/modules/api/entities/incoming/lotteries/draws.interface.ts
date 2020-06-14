import { BallCombinationsMapInterface } from './ball-combinations-map.interface';

export interface DrawInterface {
  id: number;
  lottery_id: string;
  date: string;
  date_local: string;
  last_ticket_time: string;
  status_id: string;
  number_facts: {
    [key: number]: string;
  };
  next: {
    date: string;
    id: number;
    status_id: string;
  };
  prev: {
    date: string;
    id: number;
    status_id: string;
  };
  jackpot: number | null;
  min_jackpot: number;
  currency_id: string;
  prizes: BallCombinationsMapInterface;
  winners: BallCombinationsMapInterface;
  winning_main_numbers?: Array<number>;
  winning_extra_numbers?: Array<number>;
  winning_perticket_numbers?: Array<number>;
  description: string;
}

export interface DrawsInterface {
  draws: Array<DrawInterface>;
}
