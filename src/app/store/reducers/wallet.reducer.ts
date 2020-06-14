import { WalletActions, WalletActionTypes } from '../actions/wallet.actions';

export interface State {
  skipFirstDrawParam: string | null;
}

export const initialState: State = {
  skipFirstDrawParam: null,
};

export function reducer(
  state: State = initialState,
  action: WalletActions
): State {
  switch (action.type) {
    case WalletActionTypes.SetSkipFirstDrawParam: {
      return Object.assign({}, state, {
        skipFirstDrawParam: action.payload,
      });
    }

    default: {
      return state;
    }
  }
}

export const getSkipFirstDrawParam = (state: State) => state.skipFirstDrawParam;
