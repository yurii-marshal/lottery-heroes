import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';

import { DrawsService } from '../../../services/lotteries/draws.service';
import { DrawInterface } from '../../api/entities/incoming/lotteries/draws.interface';

@Component({
  selector: 'app-lottery-widgets-jackpot-changes-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-lottery-widgets-jackpot-changes
      [currencyId]="currencyId"
      [lastJackpots]="lastJackpots$|async"
    ></app-lottery-widgets-jackpot-changes>
  `,
})
export class LotteryWidgetsJackpotChangesContainerComponent implements OnInit {
  @Input() lotteryId: string;

  lastJackpots$: Observable<number[]>;
  currencyId: string;

  constructor(private activatedRoute: ActivatedRoute,
              private drawsService: DrawsService) {
  }

  ngOnInit(): void {
    this.drawsService.getUpcomingDraw(this.lotteryId).subscribe(lottery => this.currencyId = lottery.currency_id);

    this.lastJackpots$ = this.drawsService.getLastLotteryDraws(this.lotteryId)
      .filter((lastDraws: Array<DrawInterface>) => !!lastDraws)
      .map((lastDraws: Array<DrawInterface>) => lastDraws.map((draw: DrawInterface) => draw.jackpot).reverse());
  }
}
