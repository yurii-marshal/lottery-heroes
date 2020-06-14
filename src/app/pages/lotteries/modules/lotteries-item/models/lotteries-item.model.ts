import { FreeLinesOfferEntityInterface } from '@libs/biglotteryowin-core/store/entities/offers-entity.interface';

export class LotteriesItemModel {
  constructor(
    public type: 'lottery' | 'syndicate',
    public position: number,
    public lotteryId: string,
    public lotterySlug: string,
    public lotteryName: string,
    public lotteryLogo: string,
    public jackpot: number | null,
    public minJackpot: number,
    public currencyId: string,
    public date: Date,
    public isSignificantLink: boolean,
    public freeLinesOffer?: FreeLinesOfferEntityInterface,
    public syndicateNumLines?: number,
    public syndicateNumShares?: number,
  ) {
  }
}
