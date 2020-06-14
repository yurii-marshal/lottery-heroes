import {Action} from '@ngrx/store';
import {BundleItemModel} from '../../../../../models/bundle.model';

export enum ListBundlesActionsTypes {
  AddToCart = '[List Bundles] Add to Cart'
}

export class AddToCart implements Action {
  readonly type = ListBundlesActionsTypes.AddToCart;

  constructor(public payload: { bundle: BundleItemModel, url: string }) {
  }
}

export type ListBundlesActions =
  | AddToCart;
