import { Action } from '@ngrx/store';
import {ComboItemModel} from '../../../../../models/combo.model';

export enum ListCombosActionsTypes {
  AddToCart = '[List Combos] Add to Cart'
}

export class AddToCart implements Action {
  readonly type = ListCombosActionsTypes.AddToCart;

  constructor(public payload: { combo: ComboItemModel, url: string }) {
  }
}

export type ListCombosActions =
  | AddToCart;
