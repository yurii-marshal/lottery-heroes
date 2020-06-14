import { ChangeDetectionStrategy, Component, Inject, Input, NgZone, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { timer } from 'rxjs/observable/timer';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { TicketsDesktopSandbox } from './tickets-desktop.sandbox';

import { ObjectsUtil } from '../../../../modules/shared/utils/objects.util';
import { ArraysUtil } from '../../../../modules/shared/utils/arrays.util';
import { NumbersUtil } from '../../../../modules/shared/utils/numbers.util';
import { isFilledLine } from '../../../../modules/shared/utils/lines/is-filled-line';
import { isCleanLine } from '../../../../modules/shared/utils/lines/is-clean-line';
import { LuckyNumbersItemInterface } from '../../../../services/api/entities/incoming/lotteries/lucky-numbers.interface';
import { OfferingsPricesMapInterface } from '../../../../modules/api/entities/incoming/offerings/offerings-prices.interface';
import {
  OfferingsSubscriptionDiscountInterface
} from '../../../../modules/api/entities/incoming/offerings/offerings-subscription-discounts.interface';
import { DrawInterface } from '../../../../modules/api/entities/incoming/lotteries/draws.interface';
import { LotteryInterface, LotteryRulesInterface } from '../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import {
  OfferDisplayPropertiesInterface,
  OfferFreeLinesInterface
} from '../../../../modules/api/entities/incoming/offerings/offerings-offers.interface';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../store/reducers/index';
import * as ticketsActions from '../../../../store/actions/tickets.actions';
import { of } from 'rxjs/observable/of';
import { interval } from 'rxjs/observable/interval';
import { LotteriesSortService } from '../../../../services/lotteries/lotteries-sort.service';
import { LotteriesService } from '../../../../services/lotteries/lotteries.service';
import { switchMap } from 'rxjs/operators';
import { LineInterface, SelectionTypeIdType } from '../../../../modules/api/entities/outgoing/common/line.interface';
import { CmsService } from '../../../../modules/cms/services/cms.service';

@Component({
  selector: 'app-tickets-desktop-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-tickets-desktop
      [lotteryId$]="lotteryId$"

      [rules]="rules$|async"
      [lines]="lines$|async"
      [luckyNumbers]="luckyNumbers$|async"
      [openedFreeLineIds]="openedFreeLineIds$|async"
      [autoselectAnimateCommand$]="autoselectAnimateCommand$"
      [autoselectAnimateIterations]="autoselectAnimateIterations"
      [autoselectIterationTime]="autoselectIterationTime"
      [isLoggedIn]="isLoggedIn()"
      [device$]="device$"
      [perTicketNumbers]="perTicketNumbers"

      (autoselectAllEvent)="onAutoselectAllEvent($event)"
      (clearAllEvent)="onClearAllEvent($event)"
      (addLinesEvent)="onAddLinesEvent()"
      (pickLuckyNumbersEvent)="onPickLuckyNumbersEvent()"

      (autoselectLineEvent)="onAutoselectLineEvent($event)"
      (clearLineEvent)="onClearLineEvent($event)"
      (toggleMainEvent)="onToggleMainEvent($event)"
      (toggleExtraEvent)="onToggleExtraEvent($event)"
      (autoselectForFreeLineIdEvent)="onAutoselectForFreeLineIdEvent($event)"
      (changeStatusLuckyNumbersEvent)="onChangeStatusLuckyNumbersEvent($event)"

      [freeLinesOfferDisplayProperties]="freeLinesOfferDisplayProperties$|async"
      [freeLinesOffer]="freeLinesOffer$|async"
      [lottery]="lottery$|async"
      [upcomingDraw]="upcomingDraw$|async"
      [priceTotal]="(price$|async)?.customer_total_amount"
      [discountTotal]="(price$|async)?.customer_discount_amount"
      [priceOriginal]="(price$|async)?.customer_original_amount"
      [siteCurrencyId]="siteCurrencyId$|async"
      [renewPeriods]="renewPeriods$|async"
      [selectedRenewPeriod]="selectedRenewPeriod$ | async"
      [cms]="cms$ | async"

      (changeRenewPeriodEvent)="onChangeRenewPeriodEvent($event)"
      (saveToCartEvent)="onSaveToCartEvent()"
      (addToCartFromRibbonEvent)="onAddToCartEvent($event)"
      (togglePerTicketNumbers)="onTogglePerTicketNumbers($event)"
    ></app-tickets-desktop>

    <app-lottery-widgets-before-cutoff-container
      *ngIf="(device$|async) === 'desktop'"
      [lottery]="lottery$|async"
      [upcomingDraw]="upcomingDraw$|async"
      [freeLinesOffer]="freeLinesOffer$|async"
      [offeringsPricesMap]="offeringsPricesMap$|async"
      [defaultNumberOfLines]="defaultNumberOfLines"
      (addDefiniteItemsToCartEvent)="onAddDefiniteItemsToCartEvent($event)"
    ></app-lottery-widgets-before-cutoff-container>
  `,
})
export class TicketsDesktopContainerComponent implements OnInit, OnDestroy {
  @Input() lotteryId$: Observable<string>;
  @Input() device$: Observable<string>;

  rules$: Observable<LotteryRulesInterface>;
  lines$: Observable<LineInterface[]>;
  luckyNumbers$: Observable<LuckyNumbersItemInterface[]>;
  openedFreeLineIds$: Observable<string[]>;
  autoselectAnimateCommand$: Subject<LineInterface[]> = new Subject();

  freeLinesOfferDisplayProperties$: Observable<OfferDisplayPropertiesInterface | null>;
  freeLinesOffer$: Observable<OfferFreeLinesInterface | null>;
  filledLines$: Observable<LineInterface[]>;
  offeringsPricesMap$: Observable<OfferingsPricesMapInterface>;
  lottery$: Observable<LotteryInterface>;
  upcomingDraw$: Observable<DrawInterface>;
  price$: Observable<any>;
  siteCurrencyId$: Observable<string>;
  renewPeriods$: Observable<OfferingsSubscriptionDiscountInterface[]>;
  selectedRenewPeriod$: BehaviorSubject<string | null> = new BehaviorSubject(null);
  cms$: Observable<any>;
  private countClicksOnSaveLuckyNumbers = 0;
  readonly defaultNumberOfLines = 4;

  // Turn animation
  private waitSubject$ = new BehaviorSubject<number>(0);
  readonly autoselectAnimateIterations = 6;
  readonly autoselectIterationTime = 100;
  private readonly freeLineTurnTime = 1000;
  private readonly maxAmountLinesToAdd = 300;

  // Subscriptions
  private aliveSubscriptions = true;

  // TODO: remove it
  private justLoggedIn = false;

  // Observable values
  private linesNumber: number;

  perTicketNumbers: Array<number> = [];

  constructor(private store: Store<fromRoot.State>,
              private sandbox: TicketsDesktopSandbox,
              private activatedRoute: ActivatedRoute,
              private zone: NgZone,
              private router: Router,
              @Inject(PLATFORM_ID) private platformId: Object,
              private lotteriesSortService: LotteriesSortService,
              private lotteriesService: LotteriesService,
              private cmsService: CmsService) {
  }

  ngOnInit(): void {
    const sharedLotteryId$ = this.lotteryId$.publishReplay(1).refCount();
    sharedLotteryId$
      .takeWhile(() => this.aliveSubscriptions)
      .subscribe((lotteryId: string) => this.sandbox.setSelectedLotteryId(lotteryId));

    this.rules$ = this.sandbox.getRules$();
    this.lines$ = this.sandbox.getLines$();
    this.luckyNumbers$ = this.sandbox.getLuckyNumbers();
    this.openedFreeLineIds$ = this.sandbox.getOpenedFreeLineIds$();

    this.freeLinesOfferDisplayProperties$ = this.sandbox.getFreeLinesOfferDisplayProperties$();
    this.freeLinesOffer$ = this.sandbox.getFreeLinesOffer$();
    this.offeringsPricesMap$ = this.sandbox.getPrices$();
    this.lottery$ = this.sandbox.getLottery$();
    this.upcomingDraw$ = this.sandbox.getUpcomingDraw$();

    if (isPlatformBrowser(this.platformId)) {
      this.filledLines$ = this.sandbox.getFilledLines$();
      this.filledLines$.takeWhile(() => this.aliveSubscriptions).subscribe(filledLines => {
        if (this.perTicketNumbers.length === 0 && filledLines.length > 0) {
          this.perTicketNumbers = filledLines[filledLines.length - 1].perticket_numbers;
        }
      });
    }

    this.siteCurrencyId$ = this.sandbox.getSiteCurrencyId$();
    this.renewPeriods$ = this.sandbox.getLotterySubscriptionRenewPeriods();

    this.price$ = combineLatest(
      this.siteCurrencyId$,
      this.sandbox.getFilledOpenedLines$().distinctUntilChanged((a, b) => {
        return (a ? a.length : 0) === (b ? b.length : 0);
      }),
      this.selectedRenewPeriod$,
    )
      .switchMap(([currencyId, lines, selectedRenewPeriod]: [string, Array<LineInterface>, string | null]) => {
        if (lines.length === 0) {
          return of({
            customer_total_amount: 0,
            customer_discount_amount: 0,
          });
        }

        if (selectedRenewPeriod === null) {
          return this.sandbox.getTotalPriceAmount$(currencyId, lines, []);
        } else {
          return this.sandbox.getTotalPriceAmount$(currencyId, [], [{renew_period: selectedRenewPeriod, lines}]);
        }
      })
      .publishReplay(1)
      .refCount();

    this.lines$
      .takeWhile(() => this.aliveSubscriptions)
      .subscribe((lines: Array<LineInterface>) => this.linesNumber = lines.length);

    this.initLinesIncludeRequest();

    this.cms$ = this.lottery$.publishReplay(1).refCount()
      .pipe(
        switchMap((lottery: LotteryInterface) => {
          const lotterySlug = this.lotteriesService.getSlugByLottery(lottery);

          return this.cmsService.getPageData(lotterySlug);
        })
      );
  }

  private initLinesIncludeRequest(): void {
    combineLatest(
      this.sandbox.getSelectedLotteryId$(),
      this.sandbox.getFreeLinesOffer$(),
      this.activatedRoute.queryParams.pluck('quickpick'),
      this.rules$,
      this.lottery$,
      this.device$
    )
      .takeWhile(() => this.aliveSubscriptions)
      .subscribe(([lotteryId, freeLinesOffer, quickPick, rules, lottery, device]: [string,
        OfferFreeLinesInterface | null, string | undefined, LotteryRulesInterface, LotteryInterface, string]) => {

        if (device === 'desktop') {
          let quickPickNumberOfLines: number;
          let quickPickForCondition: number;

          if (typeof quickPick !== 'undefined' && isPlatformBrowser(this.platformId)) {
            if (quickPick === 'true') {
              quickPickNumberOfLines = rules.min_lines;
            } else {
              quickPickForCondition = Math.abs(Number(quickPick));

              if (isNaN(quickPickForCondition) === false) {
                quickPickNumberOfLines = Math.abs(Number(quickPick));

                if (quickPickNumberOfLines === 0 || quickPickNumberOfLines > this.maxAmountLinesToAdd ||
                  quickPickNumberOfLines < rules.min_lines) {
                  quickPickNumberOfLines = rules.min_lines;
                }
              }
            }

            const lotterySlug = this.lotteriesService.getSlugByLottery(lottery);

            this.router.navigateByUrl('/' + lotterySlug);
          }

          this.initLines(lotteryId, freeLinesOffer, quickPickNumberOfLines);
        }
      });
  }

  private initLines(lotteryId: string, freeLinesOffer: OfferFreeLinesInterface | null, quickPick?: number): void {
    let numberOfAddedLines: number;
    if (this.linesNumber === 0) {
      numberOfAddedLines = this.addLines(lotteryId, freeLinesOffer, quickPick);
    } else {
      numberOfAddedLines = this.linesNumber;
    }

    this.sandbox.trackLotteryType(lotteryId, numberOfAddedLines);
  }

  private addLines(lotteryId: string, freeLinesOffer: OfferFreeLinesInterface | null, quickPick?: number): number {
    let generatedLines: Array<LineInterface>;

    if (freeLinesOffer !== null && (freeLinesOffer.details.is_multiplied === true || this.linesNumber === 0)) {
      generatedLines = this.generateLinesForOffer(lotteryId, freeLinesOffer, quickPick);
    } else {
      generatedLines = this.generateLines(lotteryId, this.defaultNumberOfLines, quickPick);
    }

    this.sandbox.addLines(lotteryId, generatedLines);

    return generatedLines.length;
  }

  private generateLines(lotteryId: string, numberOfLinesToGenerate: number, quickPick?: number | undefined) {
    let generatedLines: Array<LineInterface>;
    let numberNewExtraLines = 0;

    if (typeof quickPick !== 'undefined') {
      numberNewExtraLines = numberOfLinesToGenerate - (quickPick % numberOfLinesToGenerate);

      if (numberNewExtraLines === numberOfLinesToGenerate) {
        numberNewExtraLines = 0;
      }
    }

    generatedLines = this.sandbox.generateLines(
      lotteryId,
      quickPick || numberOfLinesToGenerate,
      0,
      quickPick,
    );

    generatedLines = generatedLines.concat(this.sandbox.generateLines(lotteryId, numberNewExtraLines));

    return generatedLines;
  }

  private generateLinesForOffer(lotteryId: string, freeLinesOffer: OfferFreeLinesInterface | null,
                                quickPick?: number): Array<LineInterface> {
    let generatedLines: Array<LineInterface>;
    const numberLinesOneOffer = freeLinesOffer.details.lines_to_qualify + freeLinesOffer.details.lines_free;
    const numberOfFullOffers = Math.floor(this.linesNumber / numberLinesOneOffer);
    const numberExtraLines = this.linesNumber - numberOfFullOffers * numberLinesOneOffer;
    let numberNewExtraLines = this.defaultNumberOfLines
      - (this.linesNumber + numberLinesOneOffer - numberExtraLines) % this.defaultNumberOfLines;

    if (numberNewExtraLines === this.defaultNumberOfLines) {
      numberNewExtraLines = 0;
    }

    generatedLines = this.sandbox.generateLines(
      lotteryId,
      freeLinesOffer.details.lines_to_qualify - numberExtraLines,
      freeLinesOffer.details.lines_free,
      quickPick,
    );

    while (numberNewExtraLines >= numberLinesOneOffer && freeLinesOffer.details.is_multiplied === true) {
      generatedLines = generatedLines.concat(this.sandbox.generateLines(
        lotteryId,
        freeLinesOffer.details.lines_to_qualify,
        freeLinesOffer.details.lines_free,
        quickPick,
      ));

      numberNewExtraLines -= numberLinesOneOffer;
    }

    generatedLines = generatedLines.concat(this.sandbox.generateLines(lotteryId, numberNewExtraLines));

    return generatedLines;
  }

  onAutoselectAllEvent(payload: {lines: Array<LineInterface>, rules: LotteryRulesInterface}): void {
    combineLatest(
      this.sandbox.getSelectedLotteryId$(),
      this.openedFreeLineIds$,
    )
      .first()
      .subscribe(data => {
        const lotteryId: string = data[0];
        const openedFreeLineIds: Array<string> = data[1];

        const autoselectLines = payload.lines.filter(line => ArraysUtil.inArray(openedFreeLineIds, line.id) || !line.isFree);
        this.autoselectLines(lotteryId, autoselectLines, payload.rules);
      });

    this.sandbox.trackLotteryAutoSelectAllEvent();
  }

  onClearAllEvent(payload: {lines: Array<LineInterface>}): void {
    this.sandbox.getSelectedLotteryId$()
      .first()
      .subscribe((lotteryId: string) => {
        this.clearLines(lotteryId, payload.lines);
      });

    this.perTicketNumbers = [];
    this.sandbox.trackLotteryClearAllEvent();
  }

  onAddLinesEvent(): void {
    combineLatest(
      this.sandbox.getSelectedLotteryId$(),
      this.sandbox.getFreeLinesOffer$(),
    )
      .first()
      .subscribe(data => {
        const lotteryId: string = data[0];
        const freeLinesOffer: OfferFreeLinesInterface | null = data[1];

        this.addLines(lotteryId, freeLinesOffer);
      });

    this.sandbox.trackLotteryAddLinesEvent();
  }

  onAutoselectLineEvent(payload: {line: LineInterface, rules: LotteryRulesInterface, track: boolean}): void {
    this.autoselectLines(payload.line.lottery_id, [payload.line], payload.rules);
    if (payload.track === true) {
      this.sandbox.trackLotteryAutoSelectLineEvent();
    }
  }

  onClearLineEvent(payload: {line: LineInterface}): void {
    this.clearLines(payload.line.lottery_id, [payload.line]);
    this.sandbox.trackLotteryClearLineEvent();
  }

  onToggleMainEvent(payload: {line: LineInterface, rules: LotteryRulesInterface, value: number}): void {
    const editedLine = ObjectsUtil.deepClone(payload.line);

    if (ArraysUtil.inArray(editedLine.main_numbers, payload.value)) {
      ArraysUtil.removeValue(payload.value, editedLine.main_numbers);
    } else {

      if (editedLine.main_numbers.length < payload.rules.main_numbers.picks) {
        if (editedLine.selection_type_id === 'lucky_numbers') {
          this.onChangeStatusLuckyNumbersEvent({lotteryId: editedLine.lottery_id, lineId: editedLine.id, isChecked: true});
          editedLine.main_numbers.push(payload.value);
        } else {
          editedLine.selection_type_id = this.getSelectionTypeIdOnManual(editedLine);
          editedLine.main_numbers.push(payload.value);
        }
      }
    }

    this.sandbox.updateLines(editedLine.lottery_id, [editedLine]);
    this.sandbox.trackToggleLineEvent();
  }

  onToggleExtraEvent(payload: {line: LineInterface, rules: LotteryRulesInterface, value: number}): void {
    const editedLine = ObjectsUtil.deepClone(payload.line);

    if (ArraysUtil.inArray(editedLine.extra_numbers, payload.value)) {
      ArraysUtil.removeValue(payload.value, editedLine.extra_numbers);
    } else {
      if (payload.rules.extra_numbers.picks === 1) {
        editedLine.extra_numbers = [];
      }

      if (editedLine.extra_numbers.length < payload.rules.extra_numbers.picks) {
        editedLine.selection_type_id = this.getSelectionTypeIdOnManual(editedLine);
        editedLine.extra_numbers.push(payload.value);
      }
    }

    this.sandbox.updateLines(editedLine.lottery_id, [editedLine]);
    this.sandbox.trackToggleLineEvent();
  }

  onAutoselectForFreeLineIdEvent(lineId: string): void {
    combineLatest(
      this.sandbox.getSelectedLotteryId$(),
      this.sandbox.getFreeLinesOffer$(),
      this.openedFreeLineIds$,
      this.lines$,
      this.rules$,
    )
      .first()
      .subscribe(data => {
        const lotteryId: string = data[0];
        const freeLinesOffer: OfferFreeLinesInterface | null = data[1];
        const numberOfOpenedFreeLines: number = data[2].length;
        const lines: Array<LineInterface> = data[3];
        const rules: LotteryRulesInterface = data[4];

        if (freeLinesOffer === null) {
          return;
        }

        if (numberOfOpenedFreeLines > 0 && !freeLinesOffer.details.is_multiplied) {
          return;
        }

        const freeLineIds = lines.filter(line => line.isFree).map(line => line.id);
        let clickedFreeLinePackNumber = 0;
        let freeLinePackNumber = 1;
        while (clickedFreeLinePackNumber === 0) {
          const slice = freeLineIds.slice(freeLinePackNumber * freeLinesOffer.details.lines_free - freeLinesOffer.details.lines_free,
            freeLinePackNumber * freeLinesOffer.details.lines_free);

          if (ArraysUtil.inArray(slice, lineId)) {
            clickedFreeLinePackNumber = freeLinePackNumber;
          }

          freeLinePackNumber++;
        }

        const numberOfFilledNonFreeLines: number = lines
          .filter(line => !line.isFree)
          .filter(line => isFilledLine(line, rules)).length;

        const numberOfLinesToFill = freeLinesOffer.details.lines_to_qualify * clickedFreeLinePackNumber - numberOfFilledNonFreeLines;

        const nonFilledNonFreeLines: Array<LineInterface> = lines
          .filter(line => !line.isFree)
          .filter(line => !isFilledLine(line, rules));

        const autoselectLines = nonFilledNonFreeLines.slice(0, numberOfLinesToFill);
        this.autoselectLines(lotteryId, autoselectLines, rules);
      });
  }

  onChangeRenewPeriodEvent(payload: {label: string, value: string | null}): void {
    this.selectedRenewPeriod$.next(payload.value);
    this.store.dispatch(new ticketsActions.ChangeRenewPeriod(payload));
  }

  onTogglePerTicketNumbers(payload: {rules: LotteryRulesInterface, value: number}): void {
    if (payload.rules.perticket_numbers) {
      combineLatest(
        this.lotteryId$,
        this.lines$
      )
        .first()
        .subscribe(([lotteryId, lines]) => {
          const editedLines = [];
          lines.forEach(lineItem => {
            const editedLine = ObjectsUtil.deepClone(lineItem);

            editedLine.perticket_numbers = [];

            if (ArraysUtil.inArray(editedLine.perticket_numbers, payload.value)) {
              ArraysUtil.removeValue(payload.value, editedLine.perticket_numbers);
            } else {
              if (payload.rules.perticket_numbers.picks === 1) {
                editedLine.perticket_numbers = [];
              }

              if (editedLine.perticket_numbers.length < payload.rules.perticket_numbers.picks) {
                editedLine.perticket_numbers.push(payload.value);
              }
            }

            this.perTicketNumbers = editedLine.perticket_numbers;
            editedLines.push(editedLine);
          });

          this.sandbox.updateLines(lotteryId, editedLines);
        });
    }
  }

  onSaveToCartEvent(): void {
    this.waitSubject$
      .debounce((time: number) => timer(time))
      .first()
      .switchMapTo(
        combineLatest(
          this.sandbox.getSelectedLotteryId$(),
          this.sandbox.getNonFreePartiallyFilledLines$(),
          this.sandbox.getOpenedFreePartiallyFilledLines$(),
          this.sandbox.getNonFreeNonFilledLines$(),
          this.rules$,
          this.sandbox.getMinLinesToBuy$(),
          this.sandbox.getNonFreeFilledLinesNumber$(),
          this.sandbox.getOpenedFreeLineIds$(),
          this.sandbox.getAlmostOpenedFreeLines$(),
          this.sandbox.getFilledOpenedLines$(),
          this.sandbox.getLuckyNumbersLineStatuses(),
          this.lines$,
        )
          .first()
          .do(data => {
            const luckyNumbersLineStatuses: {[lineId: string]: boolean} = data[10];
            const lines: Array<LineInterface> = data[11];
            this.sandbox.saveLuckyNumbers(this.extractLuckyNumbers(lines, luckyNumbersLineStatuses));
          })
          .do(data => {
            const lotteryId: string = data[0];
            const rules: LotteryRulesInterface = data[4];

            const minLinesToBuy: number = data[5];
            const filledOpenedLinesNumber: number = data[9].length;

            const nonFreePartiallyFilledLines: Array<LineInterface> = data[1];
            const openedFreePartiallyFilledLines: Array<LineInterface> = data[2];
            let autoselectLines = [...nonFreePartiallyFilledLines, ...openedFreePartiallyFilledLines];

            if (filledOpenedLinesNumber + autoselectLines.length < minLinesToBuy) {
              const nonFreeNonFilledLines = data[3].filter(line => !ArraysUtil.inArray(autoselectLines.map(l => l.id), line.id));
              autoselectLines = autoselectLines.concat(nonFreeNonFilledLines
                .slice(0, minLinesToBuy - filledOpenedLinesNumber - autoselectLines.length));
            }

            this.autoselectLines(lotteryId, autoselectLines, rules);
          })
          .delayWhen(data => {
            const nonFreePartiallyFilledLines: Array<LineInterface> = data[1];
            const openedFreePartiallyFilledLines: Array<LineInterface> = data[2];
            const autoselectLines = [...nonFreePartiallyFilledLines, ...openedFreePartiallyFilledLines];

            const minLinesToBuy = data[5];
            const filledOpenedLinesNumber: number = data[9].length;

            if (autoselectLines.length > 0 || filledOpenedLinesNumber + autoselectLines.length < minLinesToBuy) {
              return timer(this.autoselectAnimateIterations * this.autoselectIterationTime + this.autoselectIterationTime);
            } else {
              return timer(0);
            }
          })
          .delayWhen(data => {
            const openedFreeLineIds: Array<string> = data[7];
            const almostOpenedFreeLines: Array<LineInterface> = data[8];
            const rules: LotteryRulesInterface = data[4];

            const numberOfFreeLinesToBeOpened = almostOpenedFreeLines.length - openedFreeLineIds.length;

            if (numberOfFreeLinesToBeOpened > 0) {
              const numberOfLinesToBeOpenedAndAutoselected = almostOpenedFreeLines
                .filter(line => !ArraysUtil.inArray(openedFreeLineIds, line.id))
                .filter(line => !isFilledLine(line, rules))
                .length;

              if (numberOfLinesToBeOpenedAndAutoselected > 0) {
                return timer(this.freeLineTurnTime + this.autoselectAnimateIterations * this.autoselectIterationTime
                  + this.autoselectIterationTime);
              } else {
                return timer(this.freeLineTurnTime + this.autoselectIterationTime);
              }
            } else {
              return timer(0);
            }
          })
          .switchMapTo(combineLatest(
            this.price$,
            this.sandbox.getFilledOpenedLines$(),
            this.lottery$,
            this.selectedRenewPeriod$
          ).first()))
      .subscribe(data => {
        const totalPriceAmount: number = data[0].customer_total_amount;
        const filledOpenedLines: Array<LineInterface> = data[1];
        const lottery: LotteryInterface = data[2];
        const selectedRenewPeriod: string | null = data[3];

        this.sandbox.saveToCart(lottery.id, filledOpenedLines, selectedRenewPeriod);

        this.sandbox.trackLotteryAddToCartClick(totalPriceAmount, filledOpenedLines.length, lottery);
        this.router.navigate(['/cart']).then(() => this.sandbox.setLines(lottery.id, []));
      });
  }

  onAddDefiniteItemsToCartEvent(linesAmount): void {
    this.sandbox.createDefiniteLotteryItem$(linesAmount)
      .first()
      .takeWhile(() => this.aliveSubscriptions)
      .subscribe((items) => {
        this.sandbox.addDefiniteLotteryItemsToCart([items]);
        this.router.navigate(['/cart']);
      });
  }

  private extractLuckyNumbers(lines: Array<LineInterface>, luckyNumbersLineStatuses): Array<LuckyNumbersItemInterface> {
    // refactor
    const luckyNumbersTrueLineIds = [];
    const groups = [];

    for (const lineId in luckyNumbersLineStatuses) {
      if (luckyNumbersLineStatuses.hasOwnProperty(lineId) && luckyNumbersLineStatuses[lineId] === true) {
        luckyNumbersTrueLineIds.push(lineId);
      }
    }

    lines.filter(line => ArraysUtil.inArray(luckyNumbersTrueLineIds, line.id)).map(line => line.main_numbers)
      .map(item => {
        groups.push({numbers: item});
      });
    return groups;
  }

  private autoselectLines(lotteryId: string, lines: Array<LineInterface>, rules: LotteryRulesInterface): void {
    this.autoselectAnimateCommand$.next(lines);
    this.checkAddWait(lines.length);

    const autoSelectedLines = ObjectsUtil.deepClone(lines);

    autoSelectedLines.forEach(line => {
      let clearBeforePick = false;

      if (isFilledLine(line, rules)) {
        line.main_numbers = [];
        line.extra_numbers = [];
        clearBeforePick = true;
      }

      line.selection_type_id = this.getSelectionTypeIdOnAuto(line, clearBeforePick);

      line.main_numbers = NumbersUtil.getRandomUniqueNumbersArray(
        line.main_numbers,
        rules.main_numbers.picks,
        rules.main_numbers.lowest,
        rules.main_numbers.highest
      );

      if (rules.extra_numbers && !rules.extra_numbers.in_results_only) {
        line.extra_numbers = NumbersUtil.getRandomUniqueNumbersArray(
          line.extra_numbers,
          rules.extra_numbers.picks,
          rules.extra_numbers.lowest,
          rules.extra_numbers.highest
        );
      }

      if (rules.perticket_numbers) {
        line.perticket_numbers = line.perticket_numbers ? line.perticket_numbers : [];

        if (this.perTicketNumbers.length < rules.perticket_numbers.picks) {
          this.perTicketNumbers = NumbersUtil.getRandomUniqueNumbersArray(
            line.perticket_numbers,
            rules.perticket_numbers.picks,
            rules.perticket_numbers.lowest,
            rules.perticket_numbers.highest
          );
        }

        line.perticket_numbers = this.perTicketNumbers;
      }
    });

    this.zone.runOutsideAngular(() => {
      interval(this.autoselectAnimateIterations * this.autoselectIterationTime)
        .first()
        .subscribe(() => {
          this.zone.run(() => {
            this.sandbox.updateLines(lotteryId, autoSelectedLines);
          });
        });
    });
  }

  private clearLines(lotteryId: string, lines: Array<LineInterface>): void {
    const clearedLines = ObjectsUtil.deepClone(lines);

    clearedLines.forEach(line => {
      line.main_numbers = [];
      line.extra_numbers = [];
      line.perticket_numbers = [];
      line.selection_type_id = 'manual';
    });

    this.sandbox.updateLines(lotteryId, clearedLines);
  }

  private checkAddWait(addedAutoselectedLinesNumber: number): void {
    let result = this.autoselectAnimateIterations * this.autoselectIterationTime + this.autoselectIterationTime;

    combineLatest(
      this.sandbox.getFreeLinesOffer$(),
      this.sandbox.getNonFreeFilledLinesNumber$(),
      this.sandbox.getOpenedFreeLinesNumber$(),
      this.lines$,
      this.rules$,
    )
      .first()
      .subscribe(data => {
        const freeLinesOffer: OfferFreeLinesInterface | null = data[0];
        const nonFreeFilledLinesNumber: number = data[1];
        const openedFreeLinesNumber: number = data[2];
        const freeLines: Array<LineInterface> = data[3].filter(line => line.isFree);
        const rules: LotteryRulesInterface = data[4];

        if (freeLinesOffer === null) {
          this.waitSubject$.next(result);
          return;
        }

        let futureOpenedFreeLinesNumber: number;
        if (freeLinesOffer.details.is_multiplied) {
          futureOpenedFreeLinesNumber = Math.floor((nonFreeFilledLinesNumber + addedAutoselectedLinesNumber) /
            freeLinesOffer.details.lines_to_qualify) * freeLinesOffer.details.lines_free;
        } else {
          futureOpenedFreeLinesNumber = Math.floor(nonFreeFilledLinesNumber / freeLinesOffer.details.lines_to_qualify) >= 1
            ? freeLinesOffer.details.lines_free
            : 0;
        }

        if (futureOpenedFreeLinesNumber - openedFreeLinesNumber > 0) {
          result += this.freeLineTurnTime;

          const futureOpenedFreeLines = freeLines.slice(openedFreeLinesNumber, futureOpenedFreeLinesNumber);
          if (futureOpenedFreeLines.filter(line => isFilledLine(line, rules)).length !== futureOpenedFreeLinesNumber) {
            result += this.autoselectAnimateIterations * this.autoselectIterationTime;
          }
        }

        this.waitSubject$.next(result);
      });
  }

  private getSelectionTypeIdOnManual(line: LineInterface): SelectionTypeIdType {
    if (isCleanLine(line)) {
      return 'manual';
    } else {
      switch (line.selection_type_id) {
        case 'automatic':
          return 'mixed';
        case 'mixed':
          return 'mixed';
        default:
          return 'manual';
      }
    }
  }

  private getSelectionTypeIdOnAuto(line: LineInterface, clearBeforePick: boolean): SelectionTypeIdType {
    if (clearBeforePick) {
      return 'automatic';
    } else {
      switch (line.selection_type_id) {
        case 'manual':
          if (isCleanLine(line)) {
            return 'automatic';
          } else {
            return 'mixed';
          }
        case 'mixed':
          return 'mixed';
        default:
          return 'automatic';
      }
    }
  }

  private getSelectionTypeIdOnLucky(line: LineInterface): SelectionTypeIdType {
    return 'lucky_numbers';
  }

  onPickLuckyNumbersEvent(): void {
    combineLatest(
      this.lottery$,
      this.lines$,
      this.rules$,
      this.luckyNumbers$,
    )
      .first()
      .subscribe(
        ([lottery, lines, rules, luckyNumbers]: [LotteryInterface,
          LineInterface[], LotteryRulesInterface, LuckyNumbersItemInterface[]]) => {
          const lotteryId: string = lottery.id;
          const nonFilledLines: LineInterface[] = lines.filter(line => line.main_numbers.length === 0);
          const picks: number = rules.main_numbers.picks;
          const lowest: number = rules.main_numbers.lowest;
          const highest: number = rules.main_numbers.highest;

          const convertedLuckyNumbers: Array<number[]> = [];
          const linesClone = ObjectsUtil.deepClone(nonFilledLines);

          for (const luckyNumbersItem of luckyNumbers) {
            const luckyNumbersArray: Array<number> = luckyNumbersItem.numbers;

            if (luckyNumbersArray.length > picks) {
              ArraysUtil.shuffle(luckyNumbersArray);

              for (let i = 0; i < Math.ceil(luckyNumbersArray.length / picks); i++) {
                convertedLuckyNumbers.push(luckyNumbersArray.slice(i * picks, (i + 1) * picks));
              }

            } else {
              convertedLuckyNumbers.push(luckyNumbersArray);
            }
          }

          if (convertedLuckyNumbers.length > nonFilledLines.length) {
            let ticketsGroupsToAdd: number;

            if (nonFilledLines.length === 0) {
              ticketsGroupsToAdd = Math.ceil(convertedLuckyNumbers.length / this.defaultNumberOfLines);
            } else {
              ticketsGroupsToAdd = Math.ceil(convertedLuckyNumbers.length / nonFilledLines.length) - 1;
            }

            for (let i = 0; i < ticketsGroupsToAdd; i++) {
              this.onAddLinesEvent();
            }

            this.onPickLuckyNumbersEvent();
            return;
          }

          for (let i = 0; i < convertedLuckyNumbers.length; i++) {
            linesClone[i].main_numbers = convertedLuckyNumbers[i].filter(value => {
              return value <= highest && value >= lowest;
            });

            linesClone[i].selection_type_id = this.getSelectionTypeIdOnLucky(linesClone[i]);
          }

          this.sandbox.updateLines(lotteryId, linesClone);
          const countLines = linesClone.filter(i => i.selection_type_id === 'lucky_numbers').length;
          this.sandbox.trackMyLuckyNumbersBtnClicked(countLines);
        });
  }

  onChangeStatusLuckyNumbersEvent(payload: {lotteryId: string, lineId: string, isChecked: boolean}) {
    this.sandbox.setLuckyNumbersLineStatus(payload.lotteryId, payload.lineId, payload.isChecked);
    if (payload.isChecked === true) {
      this.trackSaveLuckyNumbers();
    }
  }

  trackSaveLuckyNumbers() {
    this.countClicksOnSaveLuckyNumbers++;
    this.sandbox.trackSaveLuckyNumbers(this.countClicksOnSaveLuckyNumbers);
  }

  // TODO: change this function to observable stream
  isLoggedIn(): boolean {
    const logState = this.sandbox.isLoggedIn();
    if (this.justLoggedIn === false && logState === true) {
      this.sandbox.loadLuckyNumbers();
      this.justLoggedIn = logState;
    }
    return this.sandbox.isLoggedIn();
  }

  onAddToCartEvent(data: any) {
    this.sandbox.addToCartEvent(data);
  }

  ngOnDestroy(): void {
    this.aliveSubscriptions = false;
  }
}
