import { createSelector } from '@ngrx/store';

import { SyndicatePageState, getSyndicatePageState } from '../reducers';

export const getSharesEntities = createSelector(
  getSyndicatePageState,
  (state: SyndicatePageState) => state.sharesEntities
);
