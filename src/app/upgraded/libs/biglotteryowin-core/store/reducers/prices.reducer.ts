import { PriceDto } from '@libs/biglotteryowin-api/dto/offerings/get-prices.dto';

import { PricesEntityInterface } from '../entities/prices-entity.interface';
import { PricesActions, PricesActionTypes } from '../actions/prices.actions';

export interface PricesState {
  entities: {[lotteryId: string]: PricesEntityInterface};
  loading: boolean;
  loaded: boolean;
}

export const initialPricesState: PricesState = {
  entities: {},
  loading: false,
  loaded: false,
};

export function pricesReducer(state = initialPricesState, action: PricesActions): PricesState {
  switch (action.type) {
    case PricesActionTypes.PricesLoadAction: {
      return {
        ...state,
        loading: true,
      };
    }

    case PricesActionTypes.PricesLoadSuccessAction: {
      const entities = {};
      Object.keys(action.payload).forEach((lotteryId: string) => {
        entities[lotteryId] = action.payload[lotteryId].prices.reduce((res: PricesEntityInterface, item: PriceDto) => {
          return {
            ...res,
            [item.base_currency_id]: {
              baseCurrencyId: item.base_currency_id,
              baseLinePrice: item.base_line_price,
            }
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

    case PricesActionTypes.PricesLoadFailAction: {
      return {
        ...state,
        loading: false,
      };
    }
  }

  return state;
}
