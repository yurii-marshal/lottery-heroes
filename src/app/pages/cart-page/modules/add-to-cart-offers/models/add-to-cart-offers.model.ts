import { OfferFreeLinesInterface } from '../../../../../modules/api/entities/incoming/offerings/offerings-offers.interface';

export class AddToCartOffersModel {
  constructor(public lotteryId: string,
              public lotteryName: string,
              public lotterySlug: string,
              public lotteryLogoUrl: string,
              public position: number,
              public jackpot: number | null,
              public minJackpot: number,
              public countdownTime: any,
              public currencyId: string,
              public isSyndicate: boolean,
              public freeLineOffer?: OfferFreeLinesInterface,
              public syndicateTemplateId?: number,
              public syndicateLineNumber?: number,
              public syndicateShareNumber?: number) {
  }
}
