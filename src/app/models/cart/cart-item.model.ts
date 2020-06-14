import { CartItemType } from '../../services/cart2/entities/cart-item.type';
import { LineInterface } from '../../modules/api/entities/outgoing/common/line.interface';

export abstract class CartItemModel {
  private static lastGeneratedId = 0;

  private _id: string;

  private static generateUniqueId(): string {
    return ++CartItemModel.lastGeneratedId + '_' + new Date().getTime();
  }

  constructor(private _type: CartItemType) {
    this._id = CartItemModel.generateUniqueId();
  }

  get id(): string {
    return this._id;
  }

  get type(): CartItemType {
    return this._type;
  }

  abstract getSerializedObject(): any;
}
