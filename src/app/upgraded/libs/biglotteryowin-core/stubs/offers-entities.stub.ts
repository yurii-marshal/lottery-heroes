import { OffersEntityInterface } from '../store/entities/offers-entity.interface';

export const offersEntitiesStub: {[lotteryId: string]: OffersEntityInterface} = {
  'megamillions': {
    'free_lines': [
      {
        offerId: 7,
        offerType: 'free_lines',
        linesToQualify: 2,
        linesFree: 1,
        isMultiplied: true,
        displayProperties: {
          shortText: '+1 FREE',
          longText: '3 LINES + 1 FREE',
          ribbonCssClass: 'purple',
          ribbonLotteriesPage: true,
        },
      }
    ]
  },
  'powerball': {
    'free_lines': [
      {
        offerId: 34,
        offerType: 'free_lines',
        linesToQualify: 3,
        linesFree: 1,
        isMultiplied: true,
        displayProperties: {
          shortText: '+1 FREE',
          longText: '3 LINES + 1 FREE',
          ribbonCssClass: 'purple',
          ribbonLotteriesPage: true,
        },
      }
    ]
  },
};
