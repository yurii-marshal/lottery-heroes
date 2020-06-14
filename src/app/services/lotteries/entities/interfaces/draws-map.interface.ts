import { DrawInterface } from '../../../../modules/api/entities/incoming/lotteries/draws.interface';

export interface DrawsMapInterface {
  [lottery_id: string]: DrawInterface;
}
