import { CartActions, CartActionTypes } from '../actions/cart.actions';
import { CartItemModel } from '../../models/cart/cart-item.model';
import { CartStoreInterface } from '../entities/cart-store.interface';

export interface State {
  items: Array<CartItemModel>;
  lastOrdered: CartStoreInterface | null;
}

export const initialState: State = {
  items: [],
  lastOrdered: null,
};

export function reducer(
  state: State = initialState,
  action: CartActions
): State {
  switch (action.type) {
    case CartActionTypes.SetCartItems: {
      return Object.assign({}, state, {
        items: action.payload,
      });
    }

    case CartActionTypes.SetLastOrdered: {
      return Object.assign({}, state, {
        lastOrdered: action.payload,
      });
    }

    default: {
      return state;
    }
  }
}

export const getItems = (state: State) => state.items;
export const getLastOrdered = (state: State) => state.lastOrdered;
