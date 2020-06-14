export interface LotteryItemModel {
  name: string;
  logo: string;
  slug: string;
  latestDrawDateLocal: Date;
  mainNumbers: number[];
  extraNumbers: number[];
  perTicketNumbers: number[];
}
