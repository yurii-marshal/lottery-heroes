import { CartItemModel } from './cart-item.model';

export class CartSyndicateItemModel extends CartItemModel {

  constructor(public templateId: number,
              public numShares: number,
              public lotteryId: string,
              public animate: boolean = true) {
    super('syndicate');
  }

  getSerializedObject(): any {
    return {
      type: this.type,
      templateId: this.templateId,
      numShares: this.numShares,
      lotteryId: this.lotteryId
    };
  }

  getSyndicateObject(): any {
    return {
      template_id: this.templateId,
      num_shares: this.numShares,
    };
  }
}
