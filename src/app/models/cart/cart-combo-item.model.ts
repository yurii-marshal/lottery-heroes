import { LineInterface } from '../../modules/api/entities/outgoing/common/line.interface';
import { CartItemModel } from './cart-item.model';

export class CartComboItemModel extends CartItemModel {
  constructor(private _comboId: any,
              public lines: Array<LineInterface>,
              public shares: Array<{ template_id: number, num_shares: number}> = [],
              public renewPeriod: string | null = null,
              public animate: boolean = false) {
    super('combo');
  }

  get comboId(): any {
    return this._comboId;
  }

  getLotteryIds(): Array<string> {
    return Object.keys(this.getLotteryLinesMap());
  }

  getLotteryLinesMap(): {[id: string]: Array<LineInterface>} {
    return this.lines ? this.lines.reduce((resultMap, line: LineInterface) => {
        return Object.assign(resultMap, {
          [line.lottery_id]: (!!resultMap[line.lottery_id] ? [...resultMap[line.lottery_id], line] : [line])
        });
    }, {}) : {};
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
      comboId: this.comboId,
      lines: this.lines,
      shares: this.shares,
      renewPeriod: this.renewPeriod,
    };
  }

  getComboObject(): any {
    return {
      id: this.comboId,
      draws: 1,
      lines: this.lines,
      shares: this.shares
    };
  }
}
