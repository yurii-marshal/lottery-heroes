import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DrawsService } from '../../../../services/lotteries/draws.service';
import { DrawInterface } from '../../../../modules/api/entities/incoming/lotteries/draws.interface';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { BrandQueryService } from '@libs/biglotteryowin-core/services/queries/brand-query.service';

@Component({
  selector: 'app-results-draw-facts-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-results-draw-facts
      [draw]="draw$|async"
    ></app-results-draw-facts>
  `,
})
export class ResultsDrawFactsContainerComponent implements OnInit {
  draw$: Observable<DrawInterface>;

  constructor(private activatedRoute: ActivatedRoute,
              private brandQueryService: BrandQueryService,
              private drawsService: DrawsService) {
  }

  ngOnInit(): void {
    const lotteryId$ = this.activatedRoute.data
      .map((data: Data) => data['lotteryId'])
      .map((lotteryId: string) => {
        if (lotteryId === 'euromillions' && this.brandQueryService.getBrandId() !== 'BIGLOTTERYOWIN_UK') {
          return 'euromillions-ie';
        }

        return lotteryId;
      });
    const dateLocal$ = this.activatedRoute.params.map((params: Params) => params['dateLocal']);

    this.draw$ = combineLatest(lotteryId$, dateLocal$)
      .switchMap(data => this.drawsService.getDrawByDate(data[0], data[1]));
  }
}
