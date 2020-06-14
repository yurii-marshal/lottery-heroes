import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { LotteriesSortService } from '../../../services/lotteries/lotteries-sort.service';

@Component({
  selector: 'app-list-of-popular-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-list-of-popular
      [lotteryIds]="lotteryIds$|async"
    ></app-list-of-popular>`
})
export class ListOfPopularContainerComponent implements OnInit {
  @Input() mainJackpotLottery;

  lotteryIds$: Observable<string[]>;

  constructor(private lotteriesSortService: LotteriesSortService) {
  }

  ngOnInit(): void {
    this.mainJackpotLottery.subscribe(lottery => {
      this.lotteryIds$ = this.lotteriesSortService.getPopularUpcomingLotteryIds(lottery);
    });
  }
}
