import { LotteryRulesInterface } from '../../../api/entities/incoming/lotteries/lotteries.interface';
import { LineInterface } from '../../../api/entities/outgoing/common/line.interface';

export const isFilledLine = (line: LineInterface, rules: LotteryRulesInterface): boolean => {
  const isMainFilled = line.main_numbers.length === rules.main_numbers.picks;

  if (rules.extra_numbers && !rules.extra_numbers.in_results_only) {
    const isExtraFilled = line.extra_numbers.length === rules.extra_numbers.picks;
    return isMainFilled && isExtraFilled;
  } else {
    return isMainFilled;
  }
};
