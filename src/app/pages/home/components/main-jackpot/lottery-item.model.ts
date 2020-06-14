export interface LotteryItemModel {
  type: string;
  lotteryId: string;
  name: string;
  logo: string;
  slug: string;
  jackpot: number | null;
  minJackpot: number;
  currencyId: string;
  time: Date;
  buttonText: string;
}
