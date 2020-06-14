import { SyndicatePageActions, SyndicatePageActionTypes } from '../actions/syndicate-page.actions';
import { createFeatureSelector } from '@ngrx/store';

export interface SyndicatePageState {
  sharesEntities: {[lotteryId: string]: number};
}

export const initialSyndicatePageState: SyndicatePageState = {
  sharesEntities: {},
};

export function syndicatePageReducer(state: SyndicatePageState = initialSyndicatePageState,
                        action: SyndicatePageActions): SyndicatePageState {
  switch (action.type) {
    case SyndicatePageActionTypes.SyndicatePageSetSharesAction: {
      const sharesEntities = {
        ...state.sharesEntities,
        [action.payload.lotteryId]: action.payload.sharesAmount,
      };

      return {
        ...state,
        sharesEntities,
      };
    }

    case SyndicatePageActionTypes.SyndicatePageAddSharesAction: {
      let sharesEntities;

      if (state.sharesEntities[action.payload.lotteryId]) {
        sharesEntities = {
          ...state.sharesEntities,
          [action.payload.lotteryId]: state.sharesEntities[action.payload.lotteryId] + action.payload.sharesAmount,
        };
      } else {
        sharesEntities = {
          ...state.sharesEntities,
          [action.payload.lotteryId]: action.payload.sharesAmount,
        };
      }

      return {
        ...state,
        sharesEntities,
      };
    }

    case SyndicatePageActionTypes.SyndicatePageRemoveSharesAction: {
      if (state.sharesEntities[action.payload.lotteryId]) {
        let sharesEntities = {
          ...state.sharesEntities,
          [action.payload.lotteryId]: state.sharesEntities[action.payload.lotteryId] - action.payload.sharesAmount,
        };

        if (sharesEntities[action.payload.lotteryId] <= 0) {
          const {[action.payload.lotteryId]: removed, ...sharesEntitiesCleaned} = state.sharesEntities;
          sharesEntities = sharesEntitiesCleaned;
        }

        return {
          ...state,
          sharesEntities,
        };
      }

      break;
    }

    case SyndicatePageActionTypes.SyndicatePageAddToCartAction: {
      const {[action.payload.lotteryId]: removed, ...sharesEntities} = state.sharesEntities;

      return {
        ...state,
        sharesEntities,
      };
    }
  }

  return state;
}

export const getSyndicatePageState = createFeatureSelector<SyndicatePageState>('SyndicatePage');
