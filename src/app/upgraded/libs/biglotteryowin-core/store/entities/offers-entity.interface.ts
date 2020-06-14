export interface OffersEntityInterface {
  'free_lines'?: FreeLinesOfferEntityInterface[];
}

export interface FreeLinesOfferEntityInterface {
  offerId: number;
  offerType: 'free_lines';
  linesToQualify: number;
  linesFree: number;
  isMultiplied: boolean;
  displayProperties: {
    shortText: string;
    longText: string;
    ribbonCssClass: string;
    ribbonLotteriesPage: boolean;
  };
}
