import { SyndicateEntityInterface } from '../store/entities/syndicate-entity.interface';
import { DrawEntityInterface } from '../store/entities/draw-entity.interface';
import { LotteryModel } from './lottery.model';
import { NumbersUtil } from '../../../../modules/shared/utils/numbers.util';

export class SyndicateModel {
  lotteryId: string;
  lotteryName: string;
  lotterySlug: string;
  lotteryLogo: string;
  lotteryLogoWide: string;
  lotteryPopularity: number;

  templateId: number;
  numLines: number;
  numShares: number;
  numSharesAvailable: number;
  stopSellTime: Date;

  currencyId: string;
  sharePrice: number;
  jackpot: number | null;
  minJackpot: number;

  lines: Array<{
    mainNumbers: number[];
    extraNumbers: number[];
    perticketNumbers: number[];
  }>;

  constructor(syndicate: SyndicateEntityInterface,
              lottery: LotteryModel,
              draw: DrawEntityInterface,
              siteCurrencyId: string,
              nullJackpot: boolean) {
    this.lotteryId = syndicate.lotteryId;
    this.lotteryName = lottery.name;
    this.lotterySlug = lottery.slug;
    this.lotteryLogo = lottery.logo;
    this.lotteryLogoWide = lottery.logoWide;
    this.lotteryPopularity = lottery.popularity;

    this.templateId = syndicate.templateId;
    this.numLines = syndicate.numLines;
    this.numShares = syndicate.numShares;
    this.numSharesAvailable = this.calculateSharesAvailable(
      syndicate.numShares,
      syndicate.numSharesAvailable,
      new Date(syndicate.cutoffTime)
    );
    this.stopSellTime = new Date(syndicate.stopSellTime);

    this.currencyId = siteCurrencyId;
    this.sharePrice = syndicate.prices[siteCurrencyId].sharePrice;
    this.jackpot = nullJackpot === true ? null : draw.jackpot;
    this.minJackpot = draw.minJackpot;

    this.lines = syndicate.lines;
  }

  private calculateSharesAvailable(numShares: number, numSharesAvailable: number, cutoffTime: Date): number {
    let result: number;

    if (new Date() < cutoffTime) {
      const percentAvailable = Math.floor((numSharesAvailable / numShares) * 100);

      if (percentAvailable > 80) {
        const minus = NumbersUtil.randomIntFromInterval(4, 7);
        result = numSharesAvailable - minus;
      } else {
        result = numSharesAvailable;
      }

      if (numSharesAvailable < 5) {
        result = NumbersUtil.randomIntFromInterval(4, 7);
      }
    } else {
      result = numSharesAvailable;
    }

    if (result > numShares) {
      result = numShares;
    }

    if (result <= 0) {
      result = 1;
    }

    return result;
  }
}
