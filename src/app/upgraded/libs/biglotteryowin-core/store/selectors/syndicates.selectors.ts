import { createSelector } from '@ngrx/store';

import { BiglotteryowinCoreState, getBiglotteryowinCoreState } from '../reducers';
import { SyndicatesState } from '../reducers/syndicates.reducer';

export const getSyndicatesState = createSelector(
  getBiglotteryowinCoreState,
  (state: BiglotteryowinCoreState) => state.syndicates
);

export const getSyndicatesEntities = createSelector(
  getSyndicatesState,
  (state: SyndicatesState) => state.entities
);

export const getSyndicatesLoading = createSelector(
  getSyndicatesState,
  (state: SyndicatesState) => state.loading
);

export const getSyndicatesLoaded = createSelector(
  getSyndicatesState,
  (state: SyndicatesState) => state.loaded
);
