import { LineInterface } from '../../outgoing/common/line.interface';

export interface DepositAndBuyInterface {
  total_amount?: number;
  discount_amount?: number;
  deposit_amount?: number;
  lines?: Array<LineInterface>;
}
