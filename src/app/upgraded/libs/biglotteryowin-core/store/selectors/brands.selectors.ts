import { createSelector } from '@ngrx/store';

import { BiglotteryowinCoreState, getBiglotteryowinCoreState } from '../reducers';
import { BrandsState } from '../reducers/brands.reducer';

export const getBrandsState = createSelector(
  getBiglotteryowinCoreState,
  (state: BiglotteryowinCoreState) => state.brands
);

export const getBrandsEntities = createSelector(
  getBrandsState,
  (state: BrandsState) => state.entities
);

export const getBrandsLoading = createSelector(
  getBrandsState,
  (state: BrandsState) => state.loading
);

export const getBrandsLoaded = createSelector(
  getBrandsState,
  (state: BrandsState) => state.loaded
);
