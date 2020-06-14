import { CartItemModel } from './cart-item.model';

import { LineInterface } from '../../modules/api/entities/outgoing/common/line.interface';

export class CartLotteryItemModel extends CartItemModel {
  constructor(private _lotteryId: string,
              public lines: Array<LineInterface>,
              public renewPeriod: string | null = null,
              public animate: boolean = false) {
    super('lottery');

    this.lines = lines.filter((line: LineInterface) => line.lottery_id === _lotteryId);
  }

  get lotteryId(): string {
    return this._lotteryId;
  }

  addLines(lines: Array<LineInterface>) {
    this.lines = [...this.lines, ...lines];
  }

  deleteLines(lineIds: Array<string>) {
    this.lines = this.lines.filter((line: LineInterface) => lineIds.indexOf(line.id) === -1);
  }

  updateLine(newLine: LineInterface): void {
    this.lines = this.lines.map((line: LineInterface) => {
      if (line.id === newLine.id) {
        line = newLine;
      }
      return line;
    });
  }

  getSerializedObject(): any {
    return {
      type: this.type,
      lotteryId: this.lotteryId,
      lines: this.lines,
      renewPeriod: this.renewPeriod,
    };
  }
}
