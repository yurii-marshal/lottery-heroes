import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

import { LotteriesService } from '../../../../services/lotteries/lotteries.service';
import { MetaService } from '../../../../modules/meta/services/meta.service';

import { DrawsService } from '../../../../services/lotteries/draws.service';
import { DatePipe } from '@angular/common';
import { JackpotFormatPipe } from '../../../../modules/shared/pipes/jackpot-format.pipe';

import { BrandParamsService } from '../../../../modules/brand/services/brand-params.service';
import { LotteryInterface } from '../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { DrawInterface } from '../../../../modules/api/entities/incoming/lotteries/draws.interface';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { BrandQueryService } from '@libs/biglotteryowin-core/services/queries/brand-query.service';

interface PagePerDrawDescription {
  lotteryName: string;
  date: string;
  dayName: string;
  dayNumAndMonthFormat1: string;
  dayNumAndMonthFormat2: string;
  year: string;
  winningNumbers: string;
  jackpot: string;
}

@Component({
  selector: 'app-results-draw-title-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-results-draw-title
      [lottery]="lottery$|async"
      [draw]="draw$|async"
      [dateFormated]="dateFormated"
    ></app-results-draw-title>
  `,
})
export class ResultsDrawTitleContainerComponent implements OnInit, OnDestroy {
  lottery$: Observable<LotteryInterface>;
  draw$: Observable<DrawInterface>;
  dateFormated: string;

  private aliveSubscriptions = true;

  constructor(private activatedRoute: ActivatedRoute,
              private drawsService: DrawsService,
              private lotteriesService: LotteriesService,
              private metaService: MetaService,
              private translate: TranslateService,
              private brandParamsService: BrandParamsService,
              private datePipe: DatePipe,
              private brandQueryService: BrandQueryService,
              private jackpotFormatPipe: JackpotFormatPipe) {
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

    this.lottery$ = lotteryId$.switchMap((lotteryId: string) => this.lotteriesService.getLottery(lotteryId));

    this.draw$ = combineLatest(lotteryId$, dateLocal$)
      .switchMap(data => this.drawsService.getDrawByDate(data[0], data[1]));

    combineLatest(
      this.lottery$,
      this.draw$,
      this.brandParamsService.getConfig('dateFormat', 'shortDateFormat')
    )
      .takeWhile(() => this.aliveSubscriptions)
      .subscribe(([lottery, draw, dateFormat]: [LotteryInterface, DrawInterface, string]) => {
        this.dateFormated = this.createDescriptionObj(lottery, draw).dayNumAndMonthFormat2 + ', '
                        + this.createDescriptionObj(lottery, draw).year;
        this.setMeta(lottery, draw, dateFormat, this.createDescriptionObj(lottery, draw));
      });
  }

  private setMeta(lottery: LotteryInterface, draw: DrawInterface, dateFormat: string, descriptionObj: PagePerDrawDescription): void {
    const date = this.datePipe.transform(draw.date_local, dateFormat);
    let firstNumber;
    if (draw.winning_main_numbers) {
      firstNumber = draw.winning_main_numbers.sort((a, b) => a - b)[0];
    }

    if (lottery.id === 'powerball' || lottery.id === 'euromillions' || lottery.id === 'euromillions-ie') {
      this.translate
        .get('ResultsDrawTitleContainerComponent.metaTitle-lottery', descriptionObj)
        .subscribe((res: string) => this.metaService.setTitle(res));
    } else {
      this.translate
        .get('ResultsDrawTitleContainerComponent.metaTitle', {lotteryName: lottery.name, date: date})
        .subscribe((res: string) => this.metaService.setTitle(res));
    }

    if (lottery.id === 'powerball' || lottery.id === 'euromillions' || lottery.id === 'euromillions-ie') {
      this.translate
        .get('ResultsDrawTitleContainerComponent.templateDescription-lottery', descriptionObj)
        .subscribe((res: string) => this.metaService.setMetaDescription(res));
    } else {
      this.translate
        .get('ResultsDrawTitleContainerComponent.templateDescription' + (firstNumber % 5), descriptionObj)
        .subscribe((res: string) => this.metaService.setMetaDescription(res));
    }
  }

  private createDescriptionObj(lottery: LotteryInterface, draw: DrawInterface): PagePerDrawDescription {
    return {
      lotteryName: lottery.name,
      date: this.datePipe.transform(draw.date_local, 'dd-MM-y'),
      dayName: this.datePipe.transform(draw.date_local, 'EEEE'),
      dayNumAndMonthFormat1: this.datePipe.transform(draw.date_local, 'd MMMM'),
      dayNumAndMonthFormat2: this.datePipe.transform(draw.date_local, 'MMM dd'),
      year: this.datePipe.transform(draw.date_local, 'y'),
      winningNumbers: this.prepareWinningNumbersForDescription(draw.winning_main_numbers, draw.winning_extra_numbers),
      jackpot: this.jackpotFormatPipe.transform(draw.jackpot, draw.currency_id, 'M', 'K', false),
    };
  }

  /**
   * Convert numbers into special format
   * @returns 8-22-23-32-33-(42)
   */
  private prepareWinningNumbersForDescription(mainNumbers: Array<number>, extraNumbers?: Array<number>) {
    let prepareNumbers;
    if (mainNumbers) {
      prepareNumbers = mainNumbers.join('-');
    }
    if (extraNumbers && extraNumbers.length > 0) {
      prepareNumbers += '-(' + extraNumbers.join('-') + ')';
    }
    return prepareNumbers;
  }

  ngOnDestroy(): void {
    this.aliveSubscriptions = false;
  }
}
