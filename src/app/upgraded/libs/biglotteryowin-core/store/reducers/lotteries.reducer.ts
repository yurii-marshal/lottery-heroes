import { LotteryDto } from '@libs/biglotteryowin-api/dto/lotteries/get-lotteries.dto';

import { LotteryEntityInterface } from '../entities/lottery-entity.interface';
import { LotteriesActions, LotteriesActionTypes } from '../actions/lotteries.actions';

export interface LotteriesState {
  entities: {[lotteryId: string]: LotteryEntityInterface};
  loading: boolean;
  loaded: boolean;
}

export const initialLotteriesState: LotteriesState = {
  entities: {},
  loading: false,
  loaded: false,
};

export function lotteriesReducer(state = initialLotteriesState, action: LotteriesActions): LotteriesState {
  switch (action.type) {
    case LotteriesActionTypes.LotteriesLoadAction: {
      return {
        ...state,
        loading: true,
      };
    }

    case LotteriesActionTypes.LotteriesLoadSuccessAction: {
      const entities = action.payload.reduce((result: {[lotteryId: string]: LotteryEntityInterface}, item: LotteryDto) => {
        return {
          ...result,
          [item.id]: {
            lotteryId: item.id,
            name: item.name,
            brands: item.brands.reduce((res: {
              [brandId: string]: {
                brandId: string;
                lotid: number;
                popularity: number;
                urlSlug: string;
                isSold: boolean;
              }
            }, brand) => {
              return {
                ...res,
                [brand.id]: {
                  brandId: brand.id,
                  lotid: brand.lotid,
                  popularity: brand.popularity,
                  urlSlug: brand.url_slug,
                  isSold: brand.is_sold,
                }
              };
            }, {}),
          }
        };
      }, {});

      return {
        ...state,
        entities,
        loading: false,
        loaded: true,
      };
    }

    case LotteriesActionTypes.LotteriesLoadFailAction: {
      return {
        ...state,
        loading: false,
      };
    }
  }

  return state;
}
