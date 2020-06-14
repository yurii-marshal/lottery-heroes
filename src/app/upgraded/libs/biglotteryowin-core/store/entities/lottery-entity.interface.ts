export interface LotteryEntityInterface {
  lotteryId: string;
  name: string;
  brands: {
    [brandId: string]: {
      brandId: string;
      lotid: number;
      popularity: number;
      urlSlug: string;
      isSold: boolean;
    }
  };
}
