import { PricesEntityInterface } from '../store/entities/prices-entity.interface';

export const pricesEntitiesStub: {[lotteryId: string]: PricesEntityInterface} = {
  'megamillions': {
    'GBP': {
      baseLinePrice: 3.5,
      baseCurrencyId: 'GBP'
    }
  },
  'powerball': {
    'GBP': {
      baseLinePrice: 4,
      baseCurrencyId: 'GBP'
    }
  },
};
