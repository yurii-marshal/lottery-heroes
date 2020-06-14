import { AuthActions, AuthActionTypes } from '../actions/auth.actions';

import { VisitorCountryInterface } from '../../services/api/entities/incoming/visitor-country.interface';

export interface State {
  redirectUrl: string;
  sessionStatus: string;
  visitorCountry: VisitorCountryInterface | {};
}

export const initialState: State = {
  redirectUrl: '/',
  sessionStatus: 'active',
  visitorCountry: {},
};

export function reducer(
  state: State = initialState,
  action: AuthActions
): State {
  switch (action.type) {
    case AuthActionTypes.SetRedirectUrl: {
      return Object.assign({}, state, {
        redirectUrl: action.payload,
      });
    }

    case AuthActionTypes.SetSessionStatus: {
      return Object.assign({}, state, {
        sessionStatus: action.payload,
      });
    }

    case AuthActionTypes.SetVisitorCountry: {
      return Object.assign({}, state, {
        visitorCountry: action.payload,
      });
    }

    default: {
      return state;
    }
  }
}

export const getRedirectUrl = (state: State) => state.redirectUrl;
export const getSessionStatus = (state: State) => state.sessionStatus;
export const getVisitorCountry = (state: State) => state.visitorCountry;
