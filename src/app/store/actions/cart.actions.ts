import { Action } from '@ngrx/store';

import { CartItemModel } from '../../models/cart/cart-item.model';
import { CartStoreInterface } from '../entities/cart-store.interface';

export enum CartActionTypes {
  SetCartItems = '[Cart] Set cart items',
  SetLastOrdered = '[Cart] Set last ordered',
  ClickSubscribe = '[Cart] Click subscribe',
  ChangeRenewPeriod = '[Cart] Change renew period',

  OpenNotificationPopup = '[Cart] Open notification pop-up',
  ClickNotificationAccept = '[Cart] Click notification to process with deal',
  ClickNotificationCancel = '[Cart] Click notification to cancel the deal',
  ClickNotificationClose = '[Cart] Click notification close',
  ConditionForDealRelevant = '[Cart] Contition for deal relevant',

  CartSyndicateAddShareAction = '[CartPage] Add shares',
  CartSyndicateRemoveShareAction = '[CartPage] Remove shares',
  CartSyndicatePageLoadedAction = '[CartPage] Page loaded with syndicate lottery in',
}

export class SetCartItems implements Action {
  readonly type = CartActionTypes.SetCartItems;

  constructor(public payload: Array<CartItemModel>) {
  }
}

export class SetLastOrdered implements Action {
  readonly type = CartActionTypes.SetLastOrdered;

  constructor(public payload: CartStoreInterface) {
  }
}

export class ClickSubscribe implements Action {
  readonly type = CartActionTypes.ClickSubscribe;

  constructor(public payload: {lotteryId: string}) {
  }
}

export class ChangeRenewPeriod implements Action {
  readonly type = CartActionTypes.ChangeRenewPeriod;

  constructor(public payload: {
    label: string;
    value: string;
  }) {
  }
}

export class OpenNotificationPopup implements Action {
  readonly type = CartActionTypes.OpenNotificationPopup;

  constructor(public payload: {lotteryId: string}) {
  }
}

export class ClickNotificationAccept implements Action {
  readonly type = CartActionTypes.ClickNotificationAccept;

  constructor(public payload: {lotteryId: string}) {
  }
}

export class ClickNotificationCancel implements Action {
  readonly type = CartActionTypes.ClickNotificationCancel;

  constructor(public payload: {lotteryId: string}) {
  }
}

export class ClickNotificationClose implements Action {
  readonly type = CartActionTypes.ClickNotificationClose;

  constructor(public payload: {lotteryId: string}) {
  }
}

export class ConditionForDealRelevant implements Action {
  readonly type = CartActionTypes.ConditionForDealRelevant;

  constructor(public payload: {lotteryId: string}) {
  }
}

export class CartSyndicateAddShareAction implements Action {
  readonly type = CartActionTypes.CartSyndicateAddShareAction;

  constructor(public payload: {sharesAmount: number}) {
  }
}

export class CartSyndicateRemoveShareAction implements Action {
  readonly type = CartActionTypes.CartSyndicateRemoveShareAction;

  constructor(public payload: {sharesAmount: number}) {
  }
}

export class CartSyndicatePageLoadedAction implements Action {
  readonly type = CartActionTypes.CartSyndicatePageLoadedAction;

  constructor(public payload: {lotteryId: string, sharesAmount: number}) {
  }
}

export type CartActions =
  | SetCartItems
  | SetLastOrdered
  | ClickSubscribe
  | ChangeRenewPeriod
  | OpenNotificationPopup
  | ClickNotificationAccept
  | ClickNotificationCancel
  | ClickNotificationClose
  | ConditionForDealRelevant
  | CartSyndicateAddShareAction
  | CartSyndicateRemoveShareAction
  | CartSyndicatePageLoadedAction;
