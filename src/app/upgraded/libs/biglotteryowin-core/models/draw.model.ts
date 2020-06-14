import { DrawEntityInterface } from '../store/entities/draw-entity.interface';

export class DrawModel {
  drawId: number;
  lotteryId: string;
  jackpot: number | null;
  minJackpot: number;
  dateLocal: string;

  constructor(draw: DrawEntityInterface) {
    this.drawId = draw.drawId;
    this.lotteryId = draw.lotteryId;
    this.jackpot = draw.jackpot;
    this.minJackpot = draw.minJackpot;
    this.dateLocal = draw.dateLocal;
  }
}
