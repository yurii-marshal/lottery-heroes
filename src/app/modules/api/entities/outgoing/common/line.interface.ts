export type SelectionTypeIdType = 'automatic' | 'manual' | 'mixed' | 'suggested' | 'lucky_numbers';

export interface LineInterface {
  id: string; // generated and used on frontend, not used on backend
  isFree: boolean; // used on frontend, not used on backend
  lottery_id: string;
  main_numbers: Array<number>;
  extra_numbers: Array<number>;
  perticket_numbers: Array<number>;
  draws: number;
  selection_type_id: SelectionTypeIdType;
}
