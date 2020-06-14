export interface LuvSubscriptionRenewPeriodInterface {
  id: number;
  lottery_id: string | null;
  name: string; // "2 Weeks"
  period: string; // "P14D",
  discount_percent: number;
}

export interface LuvSubscriptionRenewPeriodsInterface {
  subscription_renew_periods: {
    [brandId: string]: Array<LuvSubscriptionRenewPeriodInterface>;
  };
}
