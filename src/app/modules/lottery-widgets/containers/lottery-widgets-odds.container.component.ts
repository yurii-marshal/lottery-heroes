import { Component, ChangeDetectionStrategy, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';

import { LotteriesService } from '../../../services/lotteries/lotteries.service';
import { LotteryInterface } from '../../api/entities/incoming/lotteries/lotteries.interface';

@Component({
  selector: 'app-lottery-widgets-odds-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-lottery-widgets-odds
      [lottery]="lottery$|async"
    ></app-lottery-widgets-odds>
  `,
})
export class LotteryWidgetsOddsContainerComponent implements OnInit {
  @Input() lotteryId: string;

  lottery$: Observable<LotteryInterface>;

  constructor(private activatedRoute: ActivatedRoute,
              private lotteriesService: LotteriesService) {
  }

  ngOnInit(): void {
    this.lottery$ = this.lotteriesService.getLottery(this.lotteryId);
  }
}
