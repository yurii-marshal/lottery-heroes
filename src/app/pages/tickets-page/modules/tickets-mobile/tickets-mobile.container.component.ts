import { ChangeDetectionStrategy, Component, Inject, Input, NgZone, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { TicketsMobileSandbox } from './tickets-mobile.sandbox';
import { GlobalService } from '../../../../services/global.service';

import { ArraysUtil } from '../../../../modules/shared/utils/arrays.util';
import { isFilledLine } from '../../../../modules/shared/utils/lines/is-filled-line';
import { OfferingsPricesMapInterface } from '../../../../modules/api/entities/incoming/offerings/offerings-prices.interface';
import {
  OfferingsSubscriptionDiscountInterface
} from '../../../../modules/api/entities/incoming/offerings/offerings-subscription-discounts.interface';
import { LotteryInterface, LotteryRulesInterface } from '../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { DrawInterface } from '../../../../modules/api/entities/incoming/lotteries/draws.interface';
import { OfferFreeLinesInterface } from '../../../../modules/api/entities/incoming/offerings/offerings-offers.interface';
import { NumbersUtil } from '../../../../modules/shared/utils/numbers.util';
import { ObjectsUtil } from '../../../../modules/shared/utils/objects.util';

import { Store } from '@ngrx/store';
import { LinesService } from '../../../../services/lines.service';
import * as fromRoot from '../../../../store/reducers/index';
import * as ticketsActions from '../../../../store/actions/tickets.actions';
import { of } from 'rxjs/observable/of';
import { filter, switchMap } from 'rxjs/operators';
import { LotteriesService } from '../../../../services/lotteries/lotteries.service';
import { LineInterface } from '../../../../modules/api/entities/outgoing/common/line.interface';
import { CmsService } from '../../../../modules/cms/services/cms.service';

@Component({
  selector: 'app-tickets-mobile-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="editedLineDelayed">
      <app-tickets-header-mobile
        [lottery]="lottery$|async"
        [upcomingDraw]="upcomingDraw$|async"
        [freeLinesOffers]="freeLinesOffer$|async"
        (addToCartFromRibbonEvent)="addToCartEvent($event)"
      ></app-tickets-header-mobile>
      <app-ticket-mobile
        *ngIf="initLine !== null"

        [line]="initLine"
        [rules]="rules$|async"

        (numberSelectEvent)="onNumberSelectEvent($event, true)"
        (mainIsFilled)="scrollToExtra($event)"
        (autoselectEvent)="onAutoselectEvent($event, true)"
        (clearEvent)="onClearEvent($event)"

        (asideInitEvent)="onAsideInitEvent()"
        (asideDestroyEvent)="onAsideDestroyEvent()"
        (saveUpdatedLineEvent)="onSaveInitLineEvent($event)"
      ></app-ticket-mobile>
      <ng-container *ngIf="initLine === null">
        <app-tickets-title-mobile
          [rules]="rules$|async"
        ></app-tickets-title-mobile>
        <ng-container
          *ngFor="let filledLine of filledLines$|async; trackBy: trackByLineId; let lineIndex = index; let isLastLine = last;">
          <app-filled-ticket-mobile
            *ngIf="!filledLine.isFree; else freeLineTpl"

            [lineIndex]="lineIndex + 1"
            [line]="filledLine"
            [isLastLine]="isLastLine"

            (editFilledLineEvent)="onEditFilledLineEvent($event)"
            (deleteFilledLineEvent)="onDeleteFilledLineEvent($event)"
          ></app-filled-ticket-mobile>
          <ng-template #freeLineTpl>
            <app-free-filled-ticket-mobile
              [lineIndex]="lineIndex + 1"
              [line]="filledLine"
              [isLastLine]="isLastLine"

              (editFilledLineEvent)="onEditFilledLineEvent($event)"
              (deleteFilledLineEvent)="onDeleteFilledLineEvent($event)"
            ></app-free-filled-ticket-mobile>
          </ng-template>
        </ng-container>
        <app-new-ticket-mobile
          [lineIndex]="(filledLines$|async).length + 1"

          (newLineAutoselectEvent)="onNewLineAutoselectEvent()"
          (newLineEditEvent)="onNewLineEditEvent()"
        ></app-new-ticket-mobile>

        <app-super-numbers-mobile
          *ngIf="(rules$|async).perticket_numbers"
          [rules]="rules$|async"
          [perTicketNumbers]="perTicketNumbers"
          (clickPerTicketNumbersEvent)="onClickPerTicketNumbersEvent()"></app-super-numbers-mobile>
        <app-super-numbers-pick-mobile
          *ngIf="pickPerTicketNumbersDisplay"
          [rules]="rules$|async"
          [perTicketNumbers]="perTicketNumbers"
          (closePickedPerTicketNumbersEvent)="onClosePickedPerTicketNumbersEvent()"
          (savePerTicketNumbersEvent)="onSavePerTicketNumbersEvent($event)"></app-super-numbers-pick-mobile>

        <app-free-tickets-banner-mobile
          *ngIf="canAddFreeLines$|async"
          [freeLinesOffers]="freeLinesOffer$|async"
          [nonFreeFilledLines$]="nonFreeFilledLines$"
          (autoselectForFreeLineEvent)="onAutoselectForFreeLineEvent()"
        ></app-free-tickets-banner-mobile>
        <app-ticket-subscriptions-mobile
          [renewPeriods]="renewPeriods$|async"
          [selectedRenewPeriod]="selectedRenewPeriod$|async"
          (changeRenewPeriodEvent)="onChangeRenewPeriodEvent($event)"
          (subscriptionTooltipClickEvent)="onSubscriptionTooltipClickEvent()"
        ></app-ticket-subscriptions-mobile>
        <app-total-mobile
          [siteCurrencySymbol]="siteCurrencySymbol$|async"
          [priceTotal]="(price$|async)?.customer_total_amount"
          [discountTotal]="(price$|async)?.customer_discount_amount"
          [showNumberOfOpenedFreeLines]="freeLinesOffer$|async"
          [numberOfOpenedFreeLines]="(openedFreeLineIds$|async).length"

          (saveToCartEvent)="onSaveToCartEvent()"
        ></app-total-mobile>
      </ng-container>
      <app-lottery-info-container [lotteryId]="lotteryId$|async"
                                  *ngIf="(device$|async) === 'mobile' && isCmsDataFetched && !showCmsBasedLotteryInfo">
      </app-lottery-info-container>
      <app-lottery-info-cms-based-container
        *ngIf="isCmsDataFetched && showCmsBasedLotteryInfo"
        [lotteryId]="lotteryId$|async"
      ></app-lottery-info-cms-based-container>
      <app-other-lotteries-container>
        [lotteryId]="lotteryId$|async"
      </app-other-lotteries-container>
    </ng-container>

    <app-ticket-edit-mobile
      *ngIf="editedLineIndex && editedLine"
      [lineIndex]="editedLineIndex"
      [editedLineDelayed]="editedLineDelayed"

      (closeEditEvent)="onCloseEditEvent()"
    >
      <app-ticket-mobile
        [line]="editedLine"
        [rules]="rules$|async"

        (numberSelectEvent)="onNumberSelectEvent($event)"
        (mainIsFilled)="scrollToExtra($event)"
        (autoselectEvent)="onAutoselectEvent($event)"
        (clearEvent)="onClearEvent($event)"

        (asideInitEvent)="onAsideInitEvent()"
        (asideDestroyEvent)="onAsideDestroyEvent()"
        (saveUpdatedLineEvent)="onSaveEditedLineEvent($event)"
      ></app-ticket-mobile>
    </app-ticket-edit-mobile>

    <app-confirmation-remove-line-container
      *ngIf="deletedLine !== null"
      [line]="deletedLine"
      (closeRemoveLineConfirmation)="deletedLine = null"
      (removeApproved)="deleteLine($event)"
    ></app-confirmation-remove-line-container>

    <app-lottery-widgets-before-cutoff-container
      *ngIf="(device$|async) === 'mobile'"
      [lottery]="lottery$|async"
      [upcomingDraw]="upcomingDraw$|async"
      [freeLinesOffer]="freeLinesOffer$|async"
      [offeringsPricesMap]="offeringsPricesMap$|async"
      [defaultNumberOfLines]="defaultNumberOfLines"
      (addDefiniteItemsToCartEvent)="onAddDefiniteItemsToCartEvent($event)"
    ></app-lottery-widgets-before-cutoff-container>
  `,
})
export class TicketsMobileContainerComponent implements OnInit, OnDestroy {
  @Input() lotteryId$: Observable<string>;
  @Input() device$: Observable<string>;
  // device: string;

  lottery$: Observable<LotteryInterface>;
  upcomingDraw$: Observable<DrawInterface>;
  rules$: Observable<LotteryRulesInterface>;
  filledLines$: Observable<LineInterface[]>;
  nonFreeFilledLines$: Observable<LineInterface[]>;
  freeFilledLines$: Observable<LineInterface[]>;
  offeringsPricesMap$: Observable<OfferingsPricesMapInterface>;
  openedFreeLineIds$: Observable<string[]>;
  freeLinesOffer$: Observable<OfferFreeLinesInterface | null>;
  siteCurrencySymbol$: Observable<string>;
  price$: Observable<any>;
  canAddFreeLines$: Observable<boolean>;
  renewPeriods$: Observable<OfferingsSubscriptionDiscountInterface[]>;
  selectedRenewPeriod$: BehaviorSubject<string | null> = new BehaviorSubject(null);
  cms$: Observable<any>;
  readonly defaultNumberOfLines = 4;

  initLine: LineInterface | null = null;
  deletedLine: LineInterface | null = null;
  editedLineIndex: number | null = null;
  editedLine: LineInterface | null = null;

  editedLineDelayed = true;
  pickPerTicketNumbersDisplay = false;

  private aliveSubscriptions = true;
  private maxAmountLinesToAdd = 300;

  perTicketNumbers: Array<number> = [];

  showCmsBasedLotteryInfo = false;
  isCmsDataFetched = false;

  constructor(private sandbox: TicketsMobileSandbox,
              private store: Store<fromRoot.State>,
              private router: Router,
              private globalService: GlobalService,
              private activatedRoute: ActivatedRoute,
              private linesService: LinesService,
              private zone: NgZone,
              @Inject(PLATFORM_ID) private platformId: Object,
              private lotteriesService: LotteriesService,
              private cmsService: CmsService) {
  }

  ngOnInit(): void {
    this.lottery$ = this.lotteryId$.switchMap((lotteryId: string) => this.sandbox.getLottery(lotteryId));
    this.upcomingDraw$ = this.lotteryId$.switchMap((lotteryId: string) => this.sandbox.getUpcomingDraw(lotteryId));
    this.rules$ = this.lotteryId$.switchMap((lotteryId: string) => this.sandbox.getLotteryRules(lotteryId));
    this.filledLines$ = this.lotteryId$.switchMap((lotteryId: string) => this.sandbox.getFilledLotteryTickets(lotteryId));
    this.nonFreeFilledLines$ = this.lotteryId$.switchMap((lotteryId: string) => this.sandbox.getNonFreeFilledLotteryLines(lotteryId));
    this.freeFilledLines$ = this.lotteryId$.switchMap((lotteryId: string) => this.sandbox.getFreeFilledLotteryLines(lotteryId));
    this.offeringsPricesMap$ = this.sandbox.getPrices$();
    this.openedFreeLineIds$ = this.lotteryId$.switchMap((lotteryId: string) => this.sandbox.getOpenedFreeLineIds(lotteryId));
    this.freeLinesOffer$ = this.lotteryId$.switchMap((lotteryId: string) => this.sandbox.getFreeLinesOffer(lotteryId));
    this.siteCurrencySymbol$ = this.lotteryId$.switchMap((lotteryId: string) => this.sandbox.getSiteCurrencySymbol());

    this.canAddFreeLines$ = this.lotteryId$
      .switchMap((lotteryId: string) => combineLatest(
        this.filledLines$.map(lines => lines.filter(line => line.isFree).length),
        this.sandbox.getFreeLinesOffer(lotteryId),
      ))
      .map(data => {
        const numberOfFreeFilledLines: number = data[0];
        const freeLinesOffer: OfferFreeLinesInterface | null = data[1];

        if (freeLinesOffer === null) {
          return false;
        }

        if (!freeLinesOffer.details.is_multiplied && numberOfFreeFilledLines === freeLinesOffer.details.lines_free) {
          return false;
        }

        return true;
      });

    this.lotteryId$
      .takeWhile(() => this.aliveSubscriptions)
      .subscribe((lotteryId: string) => {
        this.sandbox.trackLotteryType(lotteryId, 1);
      });

    this.nonFreeFilledLines$
      .withLatestFrom(this.lotteryId$)
      .takeWhile(() => this.aliveSubscriptions)
      .subscribe(data => {
        const nonFreeFilledLines = data[0];
        const lotteryId = data[1];

        if (nonFreeFilledLines.length === 0) {
          this.sandbox.getEditedTicket(lotteryId)
            .first()
            .subscribe((editedLine: LineInterface | undefined) => {
              if (typeof editedLine !== 'undefined') {
                this.initLine = editedLine;
              } else {
                this.initLine = this.sandbox.generateLine(lotteryId);
              }
            });
        }
      });

    this.renewPeriods$ = this.lotteryId$
      .switchMap(lotteryId => this.sandbox.getLotterySubscriptionRenewPeriods(lotteryId));

    this.price$ = this.lotteryId$
      .switchMap(lotteryId => combineLatest(
        this.sandbox.getSiteCurrencyId$(),
        this.sandbox.getFilledLotteryTickets(lotteryId).distinctUntilChanged((a, b) => {
          return (a ? a.length : 0) === (b ? b.length : 0);
        }),
        this.selectedRenewPeriod$,
      ))
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

    if (isPlatformBrowser(this.platformId)) {
      this.filledLines$.takeWhile(() => this.aliveSubscriptions).subscribe(filledLines => {
        if (this.perTicketNumbers.length === 0 && filledLines.length > 0) {
          this.perTicketNumbers = filledLines[filledLines.length - 1].perticket_numbers;
        }
      });
    }

    this.addLinesFromLinesRequest();
    this.addLinesFromQuickPickRequest();

    this.cms$ = this.lottery$.publishReplay(1).refCount()
      .pipe(
        switchMap((lottery: LotteryInterface) => {
          const lotterySlug = this.lotteriesService.getSlugByLottery(lottery);

          return this.cmsService.getPageData(lotterySlug);
        })
      );

    this.cms$.publishReplay(1).refCount()
      .pipe(
        filter((cms: any) => typeof cms !== 'undefined' && cms !== null)
      )
      .subscribe(cms => {
        this.isCmsDataFetched = true;
        this.showCmsBasedLotteryInfo = this.isShowCmsBasedLotteryInfo(cms);
      });
  }

  private addLinesFromLinesRequest(): void {
    combineLatest(
      this.lottery$,
      this.filledLines$,
      this.activatedRoute.queryParams
        .pluck('lines')
        .filter((lines: string | undefined) => typeof lines !== 'undefined' && lines !== '')
        .map((lines: string) => Number(lines)),
      this.device$
    )
      .first()
      .subscribe(([lottery, filledLines, paramLinesAmount, device]: [LotteryInterface, LineInterface[], number, string]) => {

        if (device === 'mobile') {
          let linesToAdd: number;

          if (filledLines.length === 0 && paramLinesAmount > 0) {
            linesToAdd = paramLinesAmount;
          } else if (filledLines.length < paramLinesAmount) {
            linesToAdd = paramLinesAmount - filledLines.length;
          }

          const lines = this.sandbox.generateAutoselectedLines(lottery.id, linesToAdd);
          this.sandbox.addLines(lottery.id, lines);
          this.updateFreeLines();
          this.initLine = null;

          const lotterySlug = this.lotteriesService.getSlugByLottery(lottery);

          this.router.navigateByUrl('/' + lotterySlug);
        }
      });
  }

  private addLinesFromQuickPickRequest(): void {
    combineLatest(
      this.lottery$,
      this.rules$,
      this.freeLinesOffer$,
      this.filledLines$,
      this.device$,
      this.activatedRoute.queryParams.pluck('quickpick')
    )
      .first()
      .subscribe(([lottery, rules, freeLinesOffer, filledLines, device, quickPick]: [LotteryInterface,
        LotteryRulesInterface, OfferFreeLinesInterface, LineInterface[], string, string | undefined]) => {

        if (!isPlatformBrowser(this.platformId)) {
          return;
        }

        if (device === 'mobile' && filledLines.length === 0) {

          if (typeof quickPick !== 'undefined') {

            let quickPickForCondition: number;
            let lines: LineInterface[];
            let nonFreeLinesAmount: number;
            let freeLinesAmount = 0;

            if (quickPick === 'true') {
              if (freeLinesOffer !== null) {
                nonFreeLinesAmount = freeLinesOffer.details.lines_to_qualify;
                freeLinesAmount = freeLinesOffer.details.lines_free;

              } else {
                nonFreeLinesAmount = rules.min_lines;
              }

              lines = this.linesService.generateAutoselectedLines(lottery.id, nonFreeLinesAmount, freeLinesAmount);
              this.sandbox.addLines(lottery.id, lines);
              this.updateFreeLines();
              this.initLine = null;

            } else {

              quickPickForCondition = Math.abs(Number(quickPick));

              if (isNaN(quickPickForCondition) === false) {

                if (freeLinesOffer !== null) {
                  nonFreeLinesAmount = freeLinesOffer.details.lines_to_qualify;
                  freeLinesAmount = freeLinesOffer.details.lines_free;

                } else {
                  nonFreeLinesAmount = Math.abs(Number(quickPick));

                  if (nonFreeLinesAmount === 0 || nonFreeLinesAmount > this.maxAmountLinesToAdd ||
                    nonFreeLinesAmount < rules.min_lines) {

                    nonFreeLinesAmount = rules.min_lines;
                  }
                }

                lines = this.linesService.generateAutoselectedLines(lottery.id, nonFreeLinesAmount, freeLinesAmount);
                this.sandbox.addLines(lottery.id, lines);
                this.updateFreeLines();
                this.initLine = null;
              }
            }

            const lotterySlug = this.lotteriesService.getSlugByLottery(lottery);

            this.router.navigateByUrl('/' + lotterySlug);
          }
        }
      });
  }

  scrollToExtra(nativeElement: HTMLElement): void {
    this.sandbox.scrollTo(nativeElement);
  }

  onChangeRenewPeriodEvent(payload: {
    label: string, value: string | null
  }): void {
    this.selectedRenewPeriod$.next(payload.value);
    this.store.dispatch(new ticketsActions.ChangeRenewPeriod(payload));
  }

  onSubscriptionTooltipClickEvent(): void {
    this.sandbox.showLightbox(
      'general',
      '<h1>Subscribe</h1>',
      'Automatically participate in every draw. Billing will be done on a monthly basis.'
    );
  }

  onAsideInitEvent(): void {
    this.sandbox.addFooterClass('moved');
  }

  onAsideDestroyEvent(): void {
    this.sandbox.removeFooterClass('moved');
  }

  onSaveInitLineEvent(payload: {
    line: LineInterface, rules: LotteryRulesInterface
  }): void {
    this.sandbox.activateExperimentsElements();
    this.sandbox.deleteEditedTicket(payload.line.lottery_id);

    if (!isFilledLine(payload.line, payload.rules)) {
      payload.line = this.sandbox.autoselectLine(payload.line);
    }

    this.sandbox.addLines(payload.line.lottery_id, [payload.line]);
    this.initLine = null;
    this.onCloseEditEvent();
    this.trackTicketPickDoneClicked();
  }

  onSaveEditedLineEvent(payload: {
    line: LineInterface, rules: LotteryRulesInterface
  }): void {
    this.sandbox.deleteEditedTicket(payload.line.lottery_id);

    this.filledLines$
      .first()
      .subscribe(lines => {
        if (!isFilledLine(payload.line, payload.rules)) {
          payload.line = this.sandbox.autoselectLine(payload.line);
        }

        if (ArraysUtil.inArray(lines.map(line => line.id), payload.line.id)) {
          this.sandbox.updateLines(payload.line.lottery_id, [payload.line]);
        } else {
          this.sandbox.addLines(payload.line.lottery_id, [payload.line]);
          this.updateFreeLines();
        }

        this.onCloseEditEvent();
      });
    this.trackTicketPickDoneClicked();
  }

  onCloseEditEvent(): void {
    this.editedLine = null;
    this.editedLineIndex = null;
    this.globalService.isShowFooter = true;
    this.editedLineDelayed = true;
    this.sandbox.scrollToTop();
  }

  onEditFilledLineEvent(payload: {
    lineIndex: number;
    line: LineInterface
  }): void {
    this.editedLineIndex = payload.lineIndex;
    this.editedLine = payload.line;

    this.globalService.isShowFooter = false;

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.zone.run(() => {
          this.editedLineDelayed = false;
          this.sandbox.scrollToTop();
        });
      }, 400);
    });

    this.store.dispatch(new ticketsActions.ClickEditLineMobile({ numberOfLine: this.editedLineIndex }));
  }

  onDeleteFilledLineEvent(line: LineInterface): void {
    this.deletedLine = line;
    this.sandbox.trackLotteryClearLineClick();
  }

  onNewLineAutoselectEvent(): void {
    this.sandbox.trackLotteryAutoSelectLineClick();
    this.lotteryId$
      .first()
      .subscribe((lotteryId: string) => {
        this.sandbox.addLines(lotteryId, [this.sandbox.generateAutoselectedLine(lotteryId)]);
        this.updateFreeLines();
      });
  }

  onNewLineEditEvent(): void {
    combineLatest(
      this.lotteryId$,
      this.filledLines$,
    )
      .first()
      .subscribe(data => {
        const lotteryId: string = data[0];
        const filledLines: Array<LineInterface> = data[1];

        this.editedLineIndex = filledLines.length + 1;
        this.editedLine = this.sandbox.generateLine(lotteryId);

        this.globalService.isShowFooter = false;

        this.zone.runOutsideAngular(() => {
          setTimeout(() => {
            this.zone.run(() => {
              this.editedLineDelayed = false;
              this.sandbox.scrollToTop();
            });
          }, 400);
        });
      });

    this.store.dispatch(new ticketsActions.ClickPickYourOwnMobile({ lineNumber: this.editedLineIndex }));
  }

  onSaveToCartEvent(): void {
    combineLatest(
      this.price$,
      this.filledLines$,
      this.lottery$,
      this.selectedRenewPeriod$,
      this.rules$
    )
      .first()
      .subscribe(data => {
        let lines = [];
        const rules = data[4];

        if (rules.perticket_numbers) {
          data[1].map(line => {
            const singleLine = ObjectsUtil.deepClone(line);
            if (this.perTicketNumbers.length < rules.perticket_numbers.picks) {
              singleLine.perticket_numbers = this.autoSelectPerTicketNumbers(singleLine.perticket_numbers, rules);
            }
            lines.push(singleLine);
          });

          this.sandbox.updateLines(data[2].id, lines);
        } else {
          lines = data[1];
        }

        this.sandbox.saveToCart(data[2].id, lines, data[3]);
        this.sandbox.trackLotteryAddToCartClick(data[0].customer_total_amount, data[1].length, data[2]);
        this.router.navigate(['/cart']).then(() => this.sandbox.setLines(data[2].id, []));
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

  onNumberSelectEvent({line, rules}: {line: LineInterface, rules: LotteryRulesInterface}, saveEditedTicket = false): void {
    if (saveEditedTicket === true) {
      this.sandbox.setEditedTicket(line.lottery_id, line);
    }

    this.sandbox.trackLotteryNumberSelect();
  }

  onAutoselectEvent(line: LineInterface, saveEditedTicket = false): void {
    if (saveEditedTicket === true
    ) {
      this.sandbox.setEditedTicket(line.lottery_id, line);
    }

    this.sandbox.trackLotteryAutoSelectLineClick();
  }

  onClearEvent({lotteryId}: {
    lotteryId: string
  }): void {
    this.sandbox.deleteEditedTicket(lotteryId);
  }

  onAutoselectForFreeLineEvent(): void {
    this.lotteryId$
      .switchMap((lotteryId: string) => combineLatest(
        this.nonFreeFilledLines$,
        this.sandbox.getFreeLinesOffer(lotteryId),
        this.lotteryId$,
        this.filledLines$
      ))
      .first()
      .subscribe(data => {
        const nonFreeFilledLines: Array<LineInterface> = data[0];
        const freeLinesOffer: OfferFreeLinesInterface | null = data[1];
        const lotteryId: string = data[2];
        const filledLines: Array<LineInterface> = data[3];

        if (freeLinesOffer === null) {
          return;
        }

        const numberOfLinesToFill = freeLinesOffer.details.lines_to_qualify
          - nonFreeFilledLines.length % freeLinesOffer.details.lines_to_qualify;

        const linesToAdd = [];

        for (let i = 0; i < numberOfLinesToFill; i++) {
          linesToAdd.push(this.sandbox.generateAutoselectedLine(lotteryId));
        }

        this.sandbox.addLines(lotteryId, linesToAdd);
        this.updateFreeLines();

        const totalNumberOfLines = filledLines.length + numberOfLinesToFill + freeLinesOffer.details.lines_free;

        this.store.dispatch(new ticketsActions.ClickFreeLineMobile({ numberOfLines: totalNumberOfLines }));
      });
  }

  updateFreeLines(): void {
    this.lotteryId$
      .switchMap((lotteryId: string) => combineLatest(
        this.nonFreeFilledLines$,
        this.freeFilledLines$,
        this.sandbox.getFreeLinesOffer(lotteryId),
        this.lotteryId$,
      ))
      .first()
      .subscribe(([
                    nonFreeFilledLines,
                    freeFilledLines,
                    freeLinesOffer,
                    lotteryId]: [Array<LineInterface>, Array<LineInterface>, OfferFreeLinesInterface | null, string]) => {
        if (freeLinesOffer === null) {
          return;
        }

        const filledLines = [];
        let addedFreeLines = 0;

        nonFreeFilledLines.forEach((line, index) => {
          filledLines.push(line);
          if (((index + 1) % freeLinesOffer.details.lines_to_qualify) === 0) {
            if (freeLinesOffer.details.is_multiplied || addedFreeLines < freeLinesOffer.details.lines_free) {
              for (let i = 0; i < freeLinesOffer.details.lines_free; i++) {
                if (freeFilledLines.length > 0) {
                  filledLines.push(freeFilledLines.shift());
                } else {
                  filledLines.push(this.sandbox.generateAutoselectedFreeLine(lotteryId));
                }
                addedFreeLines++;
              }
            }
          }
        });

        this.sandbox.setLines(lotteryId, filledLines);
      });
  }

  deleteLine(line: LineInterface): void {
    this.sandbox.deleteLines(line.lottery_id, [line]);
    this.updateFreeLines();
  }

  addToCartEvent(data: any): void {
    this.sandbox.addToCartEvent(data);
  }

  trackByLineId(index: number, line: LineInterface): any {
    return line.id;
  }

  trackTicketPickDoneClicked() {
    this.sandbox.trackTicketPickDoneClicked();
  }

  ngOnDestroy(): void {
    this.aliveSubscriptions = false;
  }

  // Super numbers events
  onClickPerTicketNumbersEvent(): void {
    this.globalService.isShowFooter = false;
    this.pickPerTicketNumbersDisplay = true;
  }

  onClosePickedPerTicketNumbersEvent(): void {
    this.pickPerTicketNumbersDisplay = false;
    this.globalService.isShowFooter = true;
  }

  onSavePerTicketNumbersEvent(payload: {rules: LotteryRulesInterface, value: Array<number>}): void {
    if (payload.value.length < payload.rules.perticket_numbers.picks) {
      payload.value = this.autoSelectPerTicketNumbers(payload.value, payload.rules);
    }

    this.perTicketNumbers = payload.value;

    combineLatest(
      this.lotteryId$,
      this.filledLines$
    )
      .first()
      .subscribe(([lotteryId, lines]) => {
        const editedLines = [];

        lines.map((line) => {
          const singleLine = ObjectsUtil.deepClone(line);
          singleLine.perticket_numbers = payload.value;
          editedLines.push(singleLine);
        });
        this.sandbox.updateLines(lotteryId, editedLines);
        this.onClosePickedPerTicketNumbersEvent();
      });
  }

  autoSelectPerTicketNumbers(perTicketNumbers: Array<number>, rules: LotteryRulesInterface) {
    return NumbersUtil.getRandomUniqueNumbersArray(
      perTicketNumbers,
      rules.perticket_numbers.picks,
      rules.perticket_numbers.lowest,
      rules.perticket_numbers.highest
    );
  }

  private isCmsDataForBox1(cms: any): boolean {
    return cms.box1_icon || cms.box1_title || cms.box1_summary || cms.box1_link_text || cms.box1_link_url;
  }

  private isCmsDataForBox2(cms: any): boolean {
    return cms.box2_icon || cms.box2_title || cms.box2_summary || cms.box2_link_text || cms.box2_link_url;
  }

  private isCmsDataForBox3(cms: any): boolean {
    return cms.box3_icon || cms.box3_title || cms.box3_summary || cms.box3_link_text || cms.box3_link_url;
  }

  private isShowCmsBasedLotteryInfo(cms: any): boolean {
    return this.isCmsDataForBox1(cms) || this.isCmsDataForBox2(cms) || this.isCmsDataForBox3(cms) || cms.bottom_area;
  }

}
