import { LotteryInterface } from '../../../../modules/api/entities/incoming/lotteries/lotteries.interface';

export interface LotteriesMapInterface {
  [id: string]: LotteryInterface;
}
