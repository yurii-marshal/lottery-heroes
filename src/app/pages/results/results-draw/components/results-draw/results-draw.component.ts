import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { BrandParamsService } from '../../../../../modules/brand/services/brand-params.service';
import { ActivatedRoute, Data } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BrandQueryService } from '@libs/biglotteryowin-core/services/queries/brand-query.service';

@Component({
  selector: 'app-results-draw',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './results-draw.component.html',
  styleUrls: ['./results-draw.component.scss']
})
export class ResultsDrawComponent implements OnInit {
  showDrawComponents: any;
  lotteryId$: Observable<string>;

  constructor(private brandParamsService: BrandParamsService,
              private brandQueryService: BrandQueryService,
              private activatedRoute: ActivatedRoute) {
    this.brandParamsService.getConfig('drawResults')
      .subscribe(configValue => this.showDrawComponents = configValue);
  }

  ngOnInit(): void {
    this.lotteryId$ = this.activatedRoute.data
      .map((data: Data) => data['lotteryId'])
      .map((lotteryId: string) => {
        if (lotteryId === 'euromillions' && this.brandQueryService.getBrandId() !== 'BIGLOTTERYOWIN_UK') {
          return 'euromillions-ie';
        }

        return lotteryId;
      });
  }
}
