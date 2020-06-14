import { SyndicateEntityInterface } from '../store/entities/syndicate-entity.interface';

export const syndicateEntitiesStub: {[lotteryId: string]: SyndicateEntityInterface} = {
  'powerball': {
    templateId: 1,
    lotteryId: 'powerball',
    numLines: 200,
    numShares: 30,
    numSharesAvailable: 28,
    stopSellTime: '2018-03-22T20:00:00.000Z',
    cutoffTime: '2018-03-22T19:00:00.000Z',
    drawId: 3183,
    prices: {
      GBP: {
        currencyId: 'GBP',
        sharePrice: 10,
      },
    },
    lines: [
      {
        mainNumbers: [34, 6, 1, 6, 48],
        extraNumbers: [8],
        perticketNumbers: []
      }
    ]
  },
  'euromillions': {
    templateId: 2,
    lotteryId: 'euromillions',
    numLines: 10,
    numShares: 20,
    numSharesAvailable: 14,
    stopSellTime: '2018-03-24T19:35:00.000Z',
    cutoffTime: '2018-03-24T18:00:00.000Z',
    drawId: 3558,
    prices: {
      GBP: {
        currencyId: 'GBP',
        sharePrice: 5,
      },
      USD: {
        currencyId: 'USD',
        sharePrice: 7.2,
      },
    },
    lines: [
      {
        mainNumbers: [34, 6, 1, 6, 48],
        extraNumbers: [8],
        perticketNumbers: []
      }
    ]
  },
};
