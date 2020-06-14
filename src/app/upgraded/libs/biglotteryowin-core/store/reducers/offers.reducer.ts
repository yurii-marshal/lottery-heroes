import { OfferDto } from '@libs/biglotteryowin-api/dto/offerings/get-offers.dto';

import { OffersActions, OffersActionTypes } from '../actions/offers.actions';
import { OffersEntityInterface } from '../entities/offers-entity.interface';

export interface OffersState {
  entities: {[lotteryId: string]: OffersEntityInterface};
  loading: boolean;
  loaded: boolean;
}

export const initialOffersState: OffersState = {
  entities: {},
  loading: false,
  loaded: false,
};

export function offersReducer(state = initialOffersState, action: OffersActions): OffersState {
  switch (action.type) {
    case OffersActionTypes.OffersLoadAction: {
      return {
        ...state,
        loading: true,
      };
    }

    case OffersActionTypes.OffersLoadSuccessAction: {
      const entities = {};
      Object.keys(action.payload).forEach((lotteryId: string) => {
        entities[lotteryId] = action.payload[lotteryId].reduce((res, item: OfferDto) => {
          let offer;

          switch (item.offer_type) {
            case 'free_lines': {
              offer = {
                offerId: item.offer_id,
                offerType: item.offer_type,
                linesToQualify: item.details.lines_to_qualify,
                linesFree: item.details.lines_free,
                isMultiplied: item.details.is_multiplied,
                displayProperties: {
                  shortText: item.display_properties.short_text,
                  longText: item.display_properties.long_text,
                  ribbonCssClass: item.display_properties.ribbon_css_class,
                  ribbonLotteriesPage: item.display_properties.ribbon_lotteries_page,
                },
              };
            }
          }

          return {
            ...res,
            [item.offer_type]: typeof res[item.offer_type] === 'undefined' ? [offer] : res[item.offer_type].push(offer),
          };
        }, {});
      });

      return {
        ...state,
        entities,
        loading: false,
        loaded: true,
      };
    }

    case OffersActionTypes.OffersLoadFailAction: {
      return {
        ...state,
        loading: false,
      };
    }
  }

  return state;
}
