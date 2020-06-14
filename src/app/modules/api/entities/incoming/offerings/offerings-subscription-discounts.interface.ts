export interface OfferingsSubscriptionDiscountInterface {
  brand_id: string; // "BIGLOTTERYOWIN_COM"
  created_at: string; // "2017-12-08T14:04:10.000Z"
  id: number; // 45
  lottery_id: string; // "thunderball"
  name: string; // "1 Month"
  percent: number; // 10
  period: string; // "P1M"
  updated_at: string; // "2017-12-08T14:04:10.000Z"
}

export interface OfferingsSubscriptionDiscountsInterface {
  subscription_discounts: Array<OfferingsSubscriptionDiscountInterface>;
}
