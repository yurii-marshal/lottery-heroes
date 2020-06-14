export interface SyndicateEntityInterface {
  templateId: number;
  lotteryId: string;
  numLines: number;
  numShares: number;
  numSharesAvailable: number;
  stopSellTime: string;
  cutoffTime: string;
  drawId: number;
  prices: {
    [currencyId: string]: {
      currencyId: string;
      sharePrice: number;
    }
  };
  lines: Array<{
    mainNumbers: number[];
    extraNumbers: number[];
    perticketNumbers: number[];
  }>;
}
