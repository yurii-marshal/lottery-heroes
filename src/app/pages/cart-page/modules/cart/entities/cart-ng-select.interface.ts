import { IOption } from 'ng-select';

export class CartNgSelectInterface implements IOption {
  value: string;
  label: string;
  type: string;
  offerAllLines?: string;
  offerFreeLines?: string;
}
