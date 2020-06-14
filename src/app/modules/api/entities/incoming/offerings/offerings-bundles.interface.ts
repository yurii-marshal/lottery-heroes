export interface OfferingsBundleInterface {
  id: string;
  name: string;
  status_id: 'enabled' | 'disabled';
  draws_options: Array<number>;
  logo_path: string;
  items: Array<{
    type: string;
    lottery_id: string;
    syndicate_template_id: number;
    items_qty: number;
  }>;
  prices: Array<{
    currency_id: string;
    price: number;
    former_price: number;
  }>;
  is_displayed: boolean;
}

export interface OfferingsBundlesInterface {
  bundles: Array<OfferingsBundleInterface>;
}
