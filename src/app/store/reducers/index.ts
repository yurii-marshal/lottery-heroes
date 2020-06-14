import {
  ActionReducerMap,
  createSelector,
  createFeatureSelector,
} from '@ngrx/store';

import * as fromAuth from './auth.reducer';
import * as fromTickets from './tickets.reducer';
import * as fromCart from './cart.reducer';
import * as fromWallet from './wallet.reducer';

export interface State {
  auth: fromAuth.State;
  tickets: fromTickets.State;
  cart: fromCart.State;
  wallet: fromWallet.State;
}

export const reducers: ActionReducerMap<State> = {
  auth: fromAuth.reducer,
  tickets: fromTickets.reducer,
  cart: fromCart.reducer,
  wallet: fromWallet.reducer,
};

/**
 * Auth selectors
 */
export const getAuthState = createFeatureSelector<fromAuth.State>('auth');
export const getAuthRedirectUrl = createSelector(getAuthState, fromAuth.getRedirectUrl);
export const getSessionStatus = createSelector(getAuthState, fromAuth.getSessionStatus);
export const getVisitorCountry = createSelector(getAuthState, fromAuth.getVisitorCountry);

/**
 * Tickets selectors
 */
export const getTicketsState = createFeatureSelector<fromTickets.State>('tickets');
export const getSelectedLotteryId = createSelector(getTicketsState, fromTickets.getSelectedLotteryId);
export const getTickets = createSelector(getTicketsState, fromTickets.getTickets);
export const getEditedTickets = createSelector(getTicketsState, fromTickets.getEditedTickets);
export const getSelectedLotteryLines = createSelector(getSelectedLotteryId, getTickets, (lotteryId, lines) => {
  return lines[lotteryId] || [];
});
export const getLuckyNumbersLineStatuses = createSelector(getTicketsState, fromTickets.getLuckyNumbersLineStatuses);
export const getSelectedLotteryLuckyNumbersLineStatuses = createSelector(getSelectedLotteryId, getLuckyNumbersLineStatuses,
  (lotteryId, luckyNumbersLineStatuses) => {
    return luckyNumbersLineStatuses[lotteryId] || {};
  });

/**
 * Cart selectors
 */
export const getCartState = createFeatureSelector<fromCart.State>('cart');
export const getCartItems = createSelector(getCartState, fromCart.getItems);
export const getCartLastOrdered = createSelector(getCartState, fromCart.getLastOrdered);

/**
 * Wallet selectors
 */
export const getWalletState = createFeatureSelector<fromWallet.State>('wallet');
export const getSkipFirstDrawParam = createSelector(getWalletState, fromWallet.getSkipFirstDrawParam);
