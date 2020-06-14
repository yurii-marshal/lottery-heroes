import { LotteryRulesInterface } from '../../../api/entities/incoming/lotteries/lotteries.interface';
import { LineInterface } from '../../../api/entities/outgoing/common/line.interface';

export const isPartiallyFilledLine = (line: LineInterface, rules: LotteryRulesInterface): boolean => {
  const mainLength = line.main_numbers.length;
  const extraLength = line.extra_numbers.length;

  const isMainFilledPartial = (mainLength >= 1 && mainLength < rules.main_numbers.picks);

  let isExtraFilledPartial = false;
  if (rules.extra_numbers && !rules.extra_numbers.in_results_only) {
    isExtraFilledPartial = (extraLength >= 1 && extraLength < rules.extra_numbers.picks);
  }

  if (isMainFilledPartial || isExtraFilledPartial) {
    return true;
  }

  if (rules.extra_numbers && !rules.extra_numbers.in_results_only) {
    if (mainLength === 0 && extraLength === rules.extra_numbers.picks) {
      return true;
    }

    if (extraLength === 0 && mainLength === rules.main_numbers.picks) {
      return true;
    }
  }

  return false;
};
