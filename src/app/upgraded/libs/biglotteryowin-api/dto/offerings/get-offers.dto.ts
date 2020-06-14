export interface GetOffersDto {
  offers: OffersMapDto;
}

export interface OffersMapDto {
  [lotteryId: string]: OfferDto[];
}

export interface OfferDto {
  offer_id: number;
  offer_type: 'free_lines';
  details: OfferFreeLinesDetails;
  display_properties: {
    short_text: string;
    long_text: string;
    ribbon_css_class: string;
    ribbon_lotteries_page: boolean;
    is_preferred: number;
    preferred_text: string | null;
  };
}

interface OfferFreeLinesDetails {
  lines_to_qualify: number;
  lines_free: number;
  is_multiplied: boolean;
}
