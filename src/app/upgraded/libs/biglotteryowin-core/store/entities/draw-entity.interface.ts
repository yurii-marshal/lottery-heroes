export interface DrawEntityInterface {
  drawId: number;
  lotteryId: string;
  jackpot: number | null;
  minJackpot: number;
  dateLocal: string;
  lastTicketTime: string;
}
