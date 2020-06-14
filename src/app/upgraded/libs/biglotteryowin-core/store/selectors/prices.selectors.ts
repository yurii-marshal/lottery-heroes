import { createSelector } from '@ngrx/store';

import { BiglotteryowinCoreState, getBiglotteryowinCoreState } from '../reducers';
import { PricesState } from '../reducers/prices.reducer';

export const getPricesState = createSelector(
  getBiglotteryowinCoreState,
  (state: BiglotteryowinCoreState) => state.prices
);

export const getPricesEntities = createSelector(
  getPricesState,
  (state: PricesState) => state.entities
);

export const getPricesLoading = createSelector(
  getPricesState,
  (state: PricesState) => state.loading
);

export const getPricesLoaded = createSelector(
  getPricesState,
  (state: PricesState) => state.loaded
);
