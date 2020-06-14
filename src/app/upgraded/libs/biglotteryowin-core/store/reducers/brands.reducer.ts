import { BrandDto } from '@libs/biglotteryowin-api/dto/luv/get-brands.dto';

import { BrandsActions, BrandsActionTypes } from '../actions/brands.actions';
import { BrandEntityInterface } from '../entities/brand-entity.interface';

export interface BrandsState {
  entities: {[brandId: string]: BrandEntityInterface};
  loading: boolean;
  loaded: boolean;
}

export const initialBrandsState: BrandsState = {
  entities: {},
  loading: false,
  loaded: false,
};

export function brandsReducer(state = initialBrandsState, action: BrandsActions): BrandsState {
  switch (action.type) {
    case BrandsActionTypes.BrandsLoadAction: {
      return {
        ...state,
        loading: true,
      };
    }

    case BrandsActionTypes.BrandsLoadSuccessAction: {
      const entities = action.payload.reduce((result: {[brandId: string]: BrandEntityInterface}, item: BrandDto) => {
        return {
          ...result,
          [item.id]: {
            brandId: item.id,
            currencyId: item.currency_id,
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

    case BrandsActionTypes.BrandsLoadFailAction: {
      return {
        ...state,
        loading: false,
      };
    }
  }

  return state;
}
