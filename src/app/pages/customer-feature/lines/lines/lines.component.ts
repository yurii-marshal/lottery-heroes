import { Component, OnDestroy, OnInit } from '@angular/core';
import { TicketsService } from '../../../../services/tickets.service';
import { LotteriesService } from '../../../../services/lotteries/lotteries.service';
import { DeviceService } from '../../../../services/device/device.service';
import { Subscription } from 'rxjs/Subscription';
import { AccountService } from '../../../../services/account/account.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CurrencyService } from '../../../../services/auth/currency.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { SyndicatesQueryService } from '@libs/biglotteryowin-core/services/queries/syndicates-query.service';
import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';
import { ObjectsUtil } from '../../../../modules/shared/utils/objects.util';

@Component({
  selector: 'app-lines',
  templateUrl: './lines.component.html',
  styleUrls: ['./lines.component.scss']
})
export class LinesComponent implements OnInit, OnDestroy {
  lines;
  lotteries;
  syndicatesMap: { [p: string]: SyndicateModel };
  syndicatesShares;
  deviceSubscription: Subscription;
  device: string;
  isOpenOutlet = true;
  currency_id: string;
  gamelines$: BehaviorSubject<Array<any>>;
  isShowTable = false;
  isEmptyParagraph = false;

  constructor(private ticketsService: TicketsService,
              private lotteriesService: LotteriesService,
              private deviceService: DeviceService,
              private accountService: AccountService,
              private datePipe: DatePipe,
              private currencyService: CurrencyService,
              private currencyPipe: CurrencyPipe,
              private syndicatesQueryService: SyndicatesQueryService) {
    this.gamelines$ = new BehaviorSubject([]);
    this.deviceSubscription = deviceService.getDevice().subscribe(device => this.onChangeDevice(device));
    this.currencyService.getCurrencyId()
      .subscribe(id => this.currency_id = id);
  }

  ngOnInit() {
    combineLatest(
      this.lotteriesService.getLotteriesMap(),
      this.ticketsService.getSettledLines(),
      this.syndicatesQueryService.getSyndicateModelsMap(),
      this.ticketsService.getSyndicateShares(),
    )
      .take(1)
      .subscribe(
        res => {
          this.lotteries = res[0];
          this.lines = res[1].lines;
          this.syndicatesMap = res[2];
          this.syndicatesShares = res[3];
          if (this.lines.length > 0) {
            this.isShowTable = true;
          } else {
            this.isEmptyParagraph = true;
          }
          this.groupingByDrawID();
        },
        error => console.error('res', error)
      );
  }
  // group subs
  groupingByDrawID() {
    const groupingLines = this.lines.reduce(function(r, a) {
      r[a.draw_id] = r[a.draw_id] || {subscriptions: [], combos: [], bundles: [], lines: []};
      if (a.subscription_id) {
        r[a.draw_id].subscriptions.push(a);
        return r;
      }
      if (a.ordered_combo_id) {
        r[a.draw_id].combos.push(a);
        return r;
      }
      if (a.ordered_bundle_id) {
        r[a.draw_id].bundles.push(a);
        return r;
      }
      r[a.draw_id].lines.push(a);
      return r;
    }, Object.create(null));

    const groupingSyndicates = this.syndicatesShares.reduce(function(r, a) {
      r[a.draw_id] = r[a.draw_id] || {lineShares: [], comboShares: [], bundleShares: []};

      if (a.combo_id !== null) {
        r[a.draw_id].comboShares.push(a);
      } else if (a.bundle_id !== null) {
        r[a.draw_id].bundleShares.push(a);
      } else {
        r[a.draw_id].lineShares.push(a);
      }

      return r;
    }, Object.create(null));

    const groupingGames = ObjectsUtil.extend(groupingLines, groupingSyndicates);

    this.creatingObjForTableLine(groupingGames);
  }

  creatingObjForTableLine(games) {
    const gamelines = [];
    Object.keys(games)
      .map(drawId => Object.keys(games[drawId])
        .filter(type => games[drawId][type].length !== 0)
        .map(type => {
          if (type === 'subscriptions') {
            const subscriptionsSort = games[drawId][type].reduce(function (r, a) {
              r[a.subscription_id] = r[a.subscription_id] || [];
              r[a.subscription_id].push(a);
              return r;
            }, Object.create(null));
            Object.keys(subscriptionsSort)
              .map(subId => {
                const line = subscriptionsSort[subId][0];
                gamelines.push({
                  gameLines: subscriptionsSort[subId],
                  type: type,
                  subscriptionId: line.subscription_id,
                  game: this.getGameName(line.lottery_id),
                  purchased: line.draw_date,
                  purchasedValue: line.draw_date ? (this.datePipe.transform(line.draw_date, 'dd/MM/y')) : 'Upcoming',
                  winnings: this.setWinningAmount(line, subscriptionsSort[subId]),
                  winningsValue: this.setWinning(line, subscriptionsSort[subId]),
                  status: this.setStatus(line),
                  drawId: drawId,
                  lotteryId: line.lottery_id
                });
              });
          } else {
            const line = games[drawId][type][0];
            let numShares = 0;

            games[drawId][type].forEach(item => numShares += item.num_shares);

            gamelines.push({
              gameLines: games[drawId][type],
              type: type,
              game: this.getGameName(line.lottery_id) + (type === 'comboShares' || type === 'bundleShares' || type === 'lineShares' ?
                  ' - ' + numShares + (numShares === 1 ? ' Share' : ' Shares') : ''),
              purchased: line.draw_date,
              purchasedValue: line.draw_date ? (this.datePipe.transform(line.draw_date, 'dd/MM/y')) : 'Upcoming',
              winnings: this.setWinningAmount(line, games[drawId][type]),
              winningsValue: this.setWinning(line, games[drawId][type]),
              status: this.setStatus(line),
              drawId: drawId,
              lotteryId: line.lottery_id
            });
          }
        }));

    this.gamelines$.next(gamelines);
  }

  getGameName(lotId) {
    if (this.lotteries[lotId] && this.lotteries[lotId].name) {
      return this.lotteries[lotId].name;
    } else if (this.syndicatesMap[lotId] && this.syndicatesMap[lotId].lotteryName) {
      return this.syndicatesMap[lotId].lotteryName;
    } else {
      return lotId;
    }
  }


  setStatus(line) {
    const statusId = typeof (line.line_status_id) !== 'undefined' ? line.line_status_id : line.status;
    return (statusId === 'won' || statusId === 'lost') ? 'Done' : 'Active';
  }

  setWinning(line, games) {
    let lineStatus;
    const status = typeof (line.line_status_id) !== 'undefined' ? line.line_status_id : line.status;
    switch (status) {
      case 'open':
        lineStatus = 'Upcoming';
        break;
      case 'pending':
        lineStatus = 'Processing';
        break;
      case 'lost':
      case 'won':
        let winningAmount = 0;
        games.map(game => {
          if (status === 'won') {
            winningAmount += +game.customer_amount_won;
          } else {
            winningAmount += 0;
          }
        });
        lineStatus = this.currencyPipe.transform(winningAmount, this.currency_id, 'symbol', '1.2-2');
        if (winningAmount > 0) {
          lineStatus = '<span class="won">' + lineStatus + '</span>';
        }
        break;
    }
    return lineStatus;
  }

  setWinningAmount(line, games) {
    let winningAmount = 0;
    const status = typeof (line.line_status_id) !== 'undefined' ? line.line_status_id : line.status;
    switch (status) {
      case 'open':
        winningAmount = -2;
        break;
      case 'pending':
        winningAmount = -1;
        break;
      case 'lost':
      case 'won':
        games.map(game => {
          if (status === 'won') {
            winningAmount += +game.customer_amount_won;
          } else {
            winningAmount += 0;
          }
        });
        break;
    }
    return winningAmount;
  }

  onChangeDevice(device) {
    this.device = device;
  }

  onBackToMenu() {
    this.accountService.emitClick('from-back');
  }

  ngOnDestroy() {
    this.deviceSubscription.unsubscribe();
  }

}
