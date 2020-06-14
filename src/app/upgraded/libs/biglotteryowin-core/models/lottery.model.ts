import { LotteryEntityInterface } from '../store/entities/lottery-entity.interface';
import { DrawEntityInterface } from '../store/entities/draw-entity.interface';
import { PricesEntityInterface } from '../store/entities/prices-entity.interface';
import { OffersEntityInterface } from '../store/entities/offers-entity.interface';
import { FreeLinesOfferEntityInterface } from '../store/entities/offers-entity.interface';

export class LotteryModel {
  lotteryId: string;
  name: string;
  slug: string;
  lotid: number;
  popularity: number;
  isSold: boolean;

  logo: string;
  logoWide: string;

  currencyId: string;
  jackpot: number | null;
  minJackpot: number;
  lastTicketTime: Date;
  latestDrawDateLocal: Date;

  price: number;

  freeLinesOffer?: FreeLinesOfferEntityInterface;

  constructor(lottery: LotteryEntityInterface,
              upcomingDraw: DrawEntityInterface,
              latestDraw: DrawEntityInterface,
              prices: PricesEntityInterface,
              offers: OffersEntityInterface | undefined,
              locationOrigin: string,
              brandId: string,
              siteCurrencyId: string,
              nullJackpot: boolean) {
    this.lotteryId = lottery.lotteryId;
    this.name = lottery.name;
    this.slug = lottery.brands[brandId].urlSlug;
    this.lotid = lottery.brands[brandId].lotid;
    this.popularity = lottery.brands[brandId].popularity;
    this.isSold = lottery.brands[brandId].isSold;

    this.logo = locationOrigin + '/assets/images/lottery-logos/' + lottery.lotteryId + '.svg';
    this.logoWide = locationOrigin + '/assets/images/lottery-logos/lottery-logos-line/' + lottery.lotteryId + '.svg';

    this.currencyId = siteCurrencyId;
    this.jackpot = nullJackpot === true ? null : upcomingDraw.jackpot;
    this.minJackpot = upcomingDraw.minJackpot;
    this.lastTicketTime = new Date(upcomingDraw.lastTicketTime);
    this.latestDrawDateLocal = new Date(latestDraw.dateLocal);

    this.price = prices[siteCurrencyId].baseLinePrice;

    if (typeof offers !== 'undefined') {
      if (typeof offers['free_lines'] !== 'undefined') {
        this.freeLinesOffer = offers['free_lines'][0];
      }
    }
  }
}
