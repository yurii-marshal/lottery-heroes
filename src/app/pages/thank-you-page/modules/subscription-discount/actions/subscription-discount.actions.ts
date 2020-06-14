import { Action } from '@ngrx/store';

export enum SubscriptionDiscountActionsTypes {
  AddSubscriptionToCart = '[Subscription Discount] Add Subscription to Cart'
}

export class AddSubscriptionToCart implements Action {
  readonly type = SubscriptionDiscountActionsTypes.AddSubscriptionToCart;

  constructor(public payload: { url: string }) {
  }
}

export type SubscriptionDiscountActions =
  | AddSubscriptionToCart;
