import { createSelector } from '@ngrx/store';

import { BiglotteryowinCoreState, getBiglotteryowinCoreState } from '../reducers';
import { LotteriesState } from '../reducers/lotteries.reducer';

export const getLotteriesState = createSelector(
  getBiglotteryowinCoreState,
  (state: BiglotteryowinCoreState) => state.lotteries
);

export const getLotteriesEntities = createSelector(
  getLotteriesState,
  (state: LotteriesState) => state.entities
);

export const getLotteriesLoading = createSelector(
  getLotteriesState,
  (state: LotteriesState) => state.loading
);

export const getLotteriesLoaded = createSelector(
  getLotteriesState,
  (state: LotteriesState) => state.loaded
);
