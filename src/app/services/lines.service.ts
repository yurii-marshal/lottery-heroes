import { Injectable } from '@angular/core';

import { LotteriesService } from './lotteries/lotteries.service';

import { LotteriesMapInterface } from './lotteries/entities/interfaces/lotteries-map.interface';

import { IdUtil } from '../modules/shared/utils/id.util';
import { NumbersUtil } from '../modules/shared/utils/numbers.util';
import { LineInterface } from '../modules/api/entities/outgoing/common/line.interface';

@Injectable()
export class LinesService {
  private lotteriesMap: LotteriesMapInterface;

  static changeSelectionTypeIdOnManual(line: LineInterface): LineInterface {
    if (LinesService.isClean(line)) {
      line.selection_type_id = 'manual';
    } else {
      switch (line.selection_type_id) {
        case 'automatic':
          line.selection_type_id = 'mixed';
          break;
        case 'mixed':
          line.selection_type_id = 'mixed';
          break;
        default:
          line.selection_type_id = 'manual';
          break;
      }
    }
    return line;
  }

  private static changeSelectionTypeIdOnAuto(line: LineInterface, clearBeforePick: boolean): LineInterface {
    if (clearBeforePick) {
      line.selection_type_id = 'automatic';
    } else {
      switch (line.selection_type_id) {
        case 'manual':
          if (LinesService.isClean(line)) {
            line.selection_type_id = 'automatic';
          } else {
            line.selection_type_id = 'mixed';
          }
          break;
        case 'mixed':
          line.selection_type_id = 'mixed';
          break;
        default:
          line.selection_type_id = 'automatic';
          break;
      }
    }
    return line;
  }

  static clearValues(line: LineInterface): LineInterface {
    line.main_numbers = [];
    line.extra_numbers = [];
    line = LinesService.changeSelectionTypeIdOnManual(line);
    return line;
  }

  static isClean(line: LineInterface): boolean {
    return line.main_numbers.length === 0 && line.extra_numbers.length === 0;
  }

  constructor(lotteriesService: LotteriesService) {
    lotteriesService.getSoldLotteriesMap().subscribe((lotteriesMap: LotteriesMapInterface) => this.lotteriesMap = lotteriesMap);
  }

  autoselect(line: LineInterface, clearBeforePick: boolean): LineInterface {
    const lottery = this.lotteriesMap[line.lottery_id];

    if (!lottery) {
      throw Error('Can not autoselect line, lottery not found.');
    }

    const rules = lottery.rules;

    line = LinesService.changeSelectionTypeIdOnAuto(line, clearBeforePick);

    if (clearBeforePick) {
      line.main_numbers = [];
      line.extra_numbers = [];
      line.perticket_numbers = [];
    }

    line.main_numbers = NumbersUtil.getRandomUniqueNumbersArray(
      line.main_numbers,
      rules.main_numbers.picks,
      rules.main_numbers.lowest,
      rules.main_numbers.highest
    ).sort(NumbersUtil.sortNumbersAscFunction);

    if (rules.extra_numbers && !rules.extra_numbers.in_results_only) {
      line.extra_numbers = NumbersUtil.getRandomUniqueNumbersArray(line.extra_numbers,
        rules.extra_numbers.picks,
        rules.extra_numbers.lowest,
        rules.extra_numbers.highest).sort(NumbersUtil.sortNumbersAscFunction);
    }

    if (rules.perticket_numbers && line.perticket_numbers.length < rules.perticket_numbers.picks) {
      line.perticket_numbers = NumbersUtil.getRandomUniqueNumbersArray(
        line.perticket_numbers,
        rules.perticket_numbers.picks,
        rules.perticket_numbers.lowest,
        rules.perticket_numbers.highest);
    }

    return line;
  }


  generateLines(lotteryId: string, numberOfLinesToGenerate: number, numberOfFreeLinesToGenerate = 0): Array<LineInterface> {
    const lines = Array(numberOfLinesToGenerate).fill(null).map(() => this.generateLine(lotteryId));
    const freeLines = Array(numberOfFreeLinesToGenerate).fill(null).map(() => this.generateFreeLine(lotteryId));
    return lines.concat(freeLines);
  }

  generateAutoselectedLines(lotteryId: string, numberOfLinesToGenerate: number, numberOfFreeLinesToGenerate = 0): Array<LineInterface> {
    const lines = Array(numberOfLinesToGenerate).fill(null).map(() => this.generateAutoselectedLine(lotteryId));
    const freeLines = Array(numberOfFreeLinesToGenerate).fill(null).map(() => this.generateAutoselectedFreeLine(lotteryId));
    return lines.concat(freeLines);
  }

  generateAutoselectedLine(lotteryId: string): LineInterface {
    const lottery = this.lotteriesMap[lotteryId];

    if (!lottery) {
      throw Error('Can not generate autoselected line, lottery not found.');
    }
    let line = this.generateLine(lotteryId);
    line = this.autoselect(line, false);
    return line;
  }

  generateAutoselectedFreeLine(lotteryId: string): LineInterface {
    const line = this.generateAutoselectedLine(lotteryId);
    line.isFree = true;
    return line;
  }

  generateLine(lotteryId: string,
               mainNumbers: Array<number> = [],
               extraNumbers: Array<number> = [],
               perticket_numbers: Array<number> = []): LineInterface {
    const lottery = this.lotteriesMap[lotteryId];

    if (!lottery) {
      throw Error('Can not generate line, lottery not found.');
    }

    mainNumbers = mainNumbers
      .filter((value, index, array) => array.indexOf(value) === index)
      .filter(number => number >= lottery.rules.main_numbers.lowest && number <= lottery.rules.main_numbers.highest)
      .slice(0, lottery.rules.main_numbers.picks);

    if (lottery.rules.extra_numbers && !lottery.rules.extra_numbers.in_results_only) {
      extraNumbers = extraNumbers
        .filter((value, index, array) => array.indexOf(value) === index)
        .filter(number => number >= lottery.rules.extra_numbers.lowest && number <= lottery.rules.extra_numbers.highest)
        .slice(0, lottery.rules.extra_numbers.picks);
    } else {
      extraNumbers = [];
    }

    return {
      id: IdUtil.generateUniqueId(),
      isFree: false,
      lottery_id: lotteryId,
      main_numbers: mainNumbers,
      extra_numbers: extraNumbers,
      perticket_numbers: perticket_numbers,
      draws: lottery.draws_per_ticket[0],
      selection_type_id: 'manual',
    };
  }

  private generateFreeLine(lotteryId: string): LineInterface {
    const line = this.generateLine(lotteryId);
    line.isFree = true;
    return line;
  }

  isFilledLine(line: LineInterface): boolean {
    const lottery = this.lotteriesMap[line.lottery_id];

    if (!lottery) {
      throw Error('Can not check is filled line, lottery not found.');
    }

    const rules = lottery.rules;

    const isMainFilled = line.main_numbers.length === rules.main_numbers.picks;

    if (rules.extra_numbers && !rules.extra_numbers.in_results_only) {
      const isExtraFilled = line.extra_numbers.length === rules.extra_numbers.picks;
      return isMainFilled && isExtraFilled;
    } else {
      return isMainFilled;
    }
  }

  isPartialFilledLine(line: LineInterface): boolean {
    const lottery = this.lotteriesMap[line.lottery_id];
    const mainLength = line.main_numbers.length;
    const extraLength = line.extra_numbers.length;
    const isMainFilledPartial = (mainLength >= 1 && mainLength < lottery.rules.main_numbers.picks);
    let isExtraFilledPartial = false;

    if (lottery.rules.extra_numbers && !lottery.rules.extra_numbers.in_results_only) {
      isExtraFilledPartial = (extraLength >= 1 && extraLength < lottery.rules.extra_numbers.picks);
    }

    if (isMainFilledPartial || isExtraFilledPartial) {
      return true;
    }

    if (lottery.rules.extra_numbers && !lottery.rules.extra_numbers.in_results_only) {
      if (mainLength === 0 && extraLength === lottery.rules.extra_numbers.picks) {
        return true;
      }

      if (extraLength === 0 && mainLength === lottery.rules.main_numbers.picks) {
        return true;
      }
    }

    return false;
  }

  isFilledMainNumbers(line: LineInterface): boolean {
    const lottery = this.lotteriesMap[line.lottery_id];
    if (!lottery) {
      throw Error('Can not check is filled line, lottery not found.');
    }
    const rules = lottery.rules;
    return line.main_numbers.length === rules.main_numbers.picks;
  }
}
