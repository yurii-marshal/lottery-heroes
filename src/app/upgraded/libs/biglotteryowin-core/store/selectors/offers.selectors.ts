import { createSelector } from '@ngrx/store';

import { BiglotteryowinCoreState, getBiglotteryowinCoreState } from '../reducers';
import { OffersState } from '../reducers/offers.reducer';

export const getOffersState = createSelector(
  getBiglotteryowinCoreState,
  (state: BiglotteryowinCoreState) => state.offers
);

export const getOffersEntities = createSelector(
  getOffersState,
  (state: OffersState) => state.entities
);

export const getOffersLoading = createSelector(
  getOffersState,
  (state: OffersState) => state.loading
);

export const getOffersLoaded = createSelector(
  getOffersState,
  (state: OffersState) => state.loaded
);
