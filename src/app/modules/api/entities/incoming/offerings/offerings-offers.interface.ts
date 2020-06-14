export type OfferType = 'free_lines' | 'discounts_draws_all' | 'discounts_draws_additional';

export interface OfferInterface {
  offer_id: number;
  offer_type: OfferType;
  details: any;
  display_properties: OfferDisplayPropertiesInterface;
}

export interface OfferDisplayPropertiesInterface {
  short_text: string;
  long_text: string;
  ribbon_css_class: string;
  ribbon_lotteries_page: boolean;
  is_preferred: number;
  preferred_text: string | null;
}

export interface OfferDiscountsDrawsInterface extends OfferInterface {
  details: {
    min_draws: number;
    max_draws: number | null;
    discount_amount: number;
    discount_mode: 'additional' | 'all';
    discount_calc_type: string; // "percentage" ??
  };
}

export interface OfferFreeLinesInterface extends OfferInterface {
  details: {
    lines_to_qualify: number;
    lines_free: number;
    is_multiplied: boolean;
  };
}

export interface OfferingsFreeLinesOffersMapInterface {
  [lotteryId: string]: OfferFreeLinesInterface;
}

export interface OfferingsOffersMapInterface {
  [lotteryId: string]: Array<OfferInterface>;
}

export interface OfferingsOffersInterface {
  offers: OfferingsOffersMapInterface;
}
