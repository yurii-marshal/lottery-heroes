import { LotteryEntityInterface } from '../store/entities/lottery-entity.interface';

export const lotteryEntitiesStub: {[lotteryId: string]: LotteryEntityInterface} = {
  'megamillions': {
    lotteryId: 'megamillions',
    name: 'Mega Millions',
    brands: {
      BIGLOTTERYOWIN_COM: {
        brandId: 'BIGLOTTERYOWIN_COM',
        lotid: 10,
        popularity: 11,
        urlSlug: 'mega-millions',
        isSold: false,
      }
    }
  },
  'powerball': {
    lotteryId: 'powerball',
    name: 'Powerball',
    brands: {
      BIGLOTTERYOWIN_COM: {
        brandId: 'BIGLOTTERYOWIN_COM',
        lotid: 12,
        popularity: 2,
        urlSlug: 'powerball',
        isSold: true,
      }
    }
  }
};
