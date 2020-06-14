import { DrawsMapInterface } from '../services/lotteries/entities/interfaces/draws-map.interface';
import { LotteriesMapInterface } from '../services/lotteries/entities/interfaces/lotteries-map.interface';
import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';
import { type } from 'os';
import { forEach } from '@angular/router/src/utils/collection';
import { ObjectsUtil } from '../modules/shared/utils/objects.util';

export class ComboItemModel {
  public jackpotTotal: number;
  public linesTotal = 0;
  public lotteriesTotal = 0;
  public priorityOrder: number | undefined;
  public sharesTotal = 0;

  public get price(): number {
    return this.prices[0].price;
  }

  public get formerPrice(): number {
    return this.prices[0].former_price;
  }

  public get currencyId(): string {
    return this.prices[0].currency_id;
  }

  constructor(public id: string,
              public name: string,
              public status_id: 'enabled' | 'disabled',
              public is_displayed: boolean,
              public draws_options: Array<number>,
              public logo_path: string,
              public items: Array<{
                type: string;
                lottery_id: string;
                syndicate_template_id: number;
                items_qty: number;
              }>,
              private prices: Array<{
                currency_id: string;
                price: number;
                former_price: number;
              }>,
              private comboLogoDomain: string,
              private lotteriesMap: LotteriesMapInterface,
              private upcomingDrawsMap: DrawsMapInterface,
              private syndicatesMap: { [lotteryId: string]: SyndicateModel }) {
    this.jackpotTotal = this.calculateJackpotTotal();
    this.linesTotal = this.calculateLinesTotal();
    this.lotteriesTotal = this.items.length;
    this.sharesTotal = this.calculateSharesTotal();
    const clonedItems = ObjectsUtil.deepClone(this.items);

    clonedItems.forEach((item: any) => {
      item.name = '';
      item.logo_path = '';
      item.jackpot = 0;

      switch (item.type) {
        case 'lines':
          const lottery = lotteriesMap[item.lottery_id];

          if (typeof lottery === 'undefined') {
            return;
          }

          item.name = lottery.name;
          item.logo_path = lottery.logo;
          item.jackpot = this.upcomingDrawsMap[lottery.id].jackpot;
          item.min_jackpot = this.upcomingDrawsMap[lottery.id].min_jackpot;
          break;
        case 'shares':
          const syndicateModel = this.getSyndicateByTemplateId(item.syndicate_template_id);

          if (typeof syndicateModel === 'undefined') {
            return;
          }

          item.name = syndicateModel.lotteryName;
          item.logo_path = syndicateModel.lotteryLogo;
          item.jackpot = this.upcomingDrawsMap[syndicateModel.lotteryId].jackpot;
          item.min_jackpot = this.upcomingDrawsMap[syndicateModel.lotteryId].min_jackpot;
          break;
      }
    });

    this.items = clonedItems;
    this.logo_path = this.comboLogoDomain + this.logo_path;
  }

  private calculateLinesTotal(): number {
    return this.items.reduce((sum: number, item) => {
      if (item.type === 'lines') {
        return sum + item.items_qty;
      } else {
        return sum;
      }
    }, 0);
  }

  private calculateJackpotTotal(): number {
    const lotteryIds = [];

    this.items.forEach(item => {
      switch (item.type) {
        case 'lines':
          lotteryIds.push(item.lottery_id);
          break;
        case 'shares':
          const syndicateModel = this.getSyndicateByTemplateId(item.syndicate_template_id);

          if (typeof syndicateModel !== 'undefined') {
           lotteryIds.push(syndicateModel.lotteryId);
          }
          break;
      }
    });
    return lotteryIds.reduce((sum: number, lotteryId: string) => {
      if (this.upcomingDrawsMap[lotteryId]) {
        return sum + (this.upcomingDrawsMap[lotteryId].jackpot || this.upcomingDrawsMap[lotteryId].min_jackpot);
      }
    }, 0);
  }

  private calculateSharesTotal(): number {
    return this.items.reduce((sum: number, item) => {
      if (item.type === 'shares') {
        return sum + item.items_qty;
      } else {
        return sum;
      }
    }, 0);
  }

  private getSyndicateByTemplateId(templateId: number): SyndicateModel | undefined {
    return Object.keys(this.syndicatesMap)
      .map((lotteryId: string) => this.syndicatesMap[lotteryId])
      .find((syndicate: SyndicateModel) => syndicate.templateId === templateId);
  }
}
