import { Component, ChangeDetectionStrategy, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { LotteriesService } from '../../../../services/lotteries/lotteries.service';
import { DrawsService } from '../../../../services/lotteries/draws.service';
import { LuvService } from '../../../../services/luv.service';

import { LuvCountryInterface } from '../../../../services/api/entities/incoming/luv/luv-countries.interface';
import { BrandParamsService } from '../../../../modules/brand/services/brand-params.service';
import { LotteryInterface } from '../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { DrawInterface } from '../../../../modules/api/entities/incoming/lotteries/draws.interface';
import { of } from 'rxjs/observable/of';
import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';
import { filter, switchMap } from 'rxjs/operators';
import { SyndicatesQueryService } from '@libs/biglotteryowin-core/services/queries/syndicates-query.service';

@Component({
  selector: 'app-results-item-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-results-item
    [position]="position"
    [lottery]="lottery$ | async"
    [latestDraw]="latestDraw$ | async"
    [lotteryCountryName]="lotteryCountryName$ | async"
    [syndicate]="syndicate$ | async"
  ></app-results-item>`
})
export class ResultsItemContainerComponent implements OnInit {
  @Input() position: number;
  @Input() lotteryId: string;

  lotteryCountryName$: Observable<string>;

  lottery$: Observable<LotteryInterface>;
  latestDraw$: Observable<DrawInterface>;
  syndicate$: Observable<SyndicateModel>;

  constructor(private lotteriesService: LotteriesService,
              private drawsService: DrawsService,
              private luvService: LuvService,
              private brandParamsService: BrandParamsService,
              private syndicatesQueryService: SyndicatesQueryService) {
  }

  ngOnInit() {
    this.lottery$ = this.lotteriesService.getLottery(this.lotteryId).publishReplay(1).refCount();
    this.latestDraw$ = this.drawsService.getLatestDraw(this.lotteryId);
    this.lotteryCountryName$ = this.lottery$
      .switchMap((lottery: LotteryInterface) => {
        const currentBrandId = this.brandParamsService.getBrandId();
        let countryName = '';
        lottery.brands.forEach(brand => {
          if (brand.id === currentBrandId) {
            countryName = brand.custom_country_short;
          }
        });
        if (countryName !== null && countryName !== '') {
          return of(countryName);
        }
        return this.luvService.getCountries()
          .map((countries: Array<LuvCountryInterface>) => LuvService.findCountryNameInCountries(countries, lottery.country_id));
      });
    this.syndicate$ = this.lottery$
      .pipe(
        filter((lottery: LotteryInterface) => typeof lottery !== 'undefined'),
        switchMap((lottery: LotteryInterface) => this.syndicatesQueryService.getSyndicateModelByLotteryId(lottery.id)),
        filter((syndicate: SyndicateModel) => typeof syndicate !== 'undefined')
      );
  }
}
