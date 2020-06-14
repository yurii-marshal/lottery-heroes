import { createSelector } from '@ngrx/store';

import { BiglotteryowinCoreState, getBiglotteryowinCoreState } from '../reducers';
import { DrawsState } from '../reducers/draws.reducer';

export const getDrawsState = createSelector(
  getBiglotteryowinCoreState,
  (state: BiglotteryowinCoreState) => state.draws
);

/*********************************************************************************
 * UPCOMING
 *********************************************************************************/
export const getUpcomingDrawsEntities = createSelector(
  getDrawsState,
  (state: DrawsState) => state.upcomingEntities
);

export const getUpcomingDrawsLoading = createSelector(
  getDrawsState,
  (state: DrawsState) => state.upcomingLoading
);

export const getUpcomingDrawsLoaded = createSelector(
  getDrawsState,
  (state: DrawsState) => state.upcomingLoaded
);

/*********************************************************************************
 * LATEST
 *********************************************************************************/
export const getLatestDrawsEntities = createSelector(
  getDrawsState,
  (state: DrawsState) => state.latestEntities
);

export const getLatestDrawsLoading = createSelector(
  getDrawsState,
  (state: DrawsState) => state.latestLoading
);

export const getLatestDrawsLoaded = createSelector(
  getDrawsState,
  (state: DrawsState) => state.latestLoaded
);

/*********************************************************************************
 * DRAW BY ID
 *********************************************************************************/
export const getDrawByIdEntities = createSelector(
  getDrawsState,
  (state: DrawsState) => state.drawByIdEntities
);

export const getDrawByIdLoading = createSelector(
  getDrawsState,
  (state: DrawsState) => state.drawByIdLoading
);

/*********************************************************************************
 * DRAW BY DATE LOCAL
 *********************************************************************************/
export const getDrawByDateLocalEntities = createSelector(
  getDrawsState,
  (state: DrawsState) => state.drawByDateLocalEntities
);

export const getDrawByDateLocalLoading = createSelector(
  getDrawsState,
  (state: DrawsState) => state.drawByDateLocalLoading
);
