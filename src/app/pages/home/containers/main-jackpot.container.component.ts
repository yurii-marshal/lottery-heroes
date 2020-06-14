import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { LotteriesService } from '../../../services/lotteries/lotteries.service';
import { LotteriesSortService } from '../../../services/lotteries/lotteries-sort.service';

import { OfferingsService } from '../../../services/offerings/offerings.service';
import { Cart2Service } from '../../../services/cart2/cart2.service';
import { Cart2LotteryService } from '../../../services/cart2/cart2-lottery.service';
import { SyndicatesQueryService } from '@libs/biglotteryowin-core/services/queries/syndicates-query.service';
import { LotteriesQueryService } from '@libs/biglotteryowin-core/services/queries/lotteries-query.service';

import { of } from 'rxjs/observable/of';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first, map } from 'rxjs/operators';

import { OfferFreeLinesInterface } from '../../../modules/api/entities/incoming/offerings/offerings-offers.interface';
import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';
import { LotteryModel } from '@libs/biglotteryowin-core/models/lottery.model';
import { LotteryItemModel } from '../components/main-jackpot/lottery-item.model';

@Component({
  selector: 'app-main-jackpot-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-main-jackpot
			[brandId]="brandId"
      [item]="item$ | async"
      [freeLine]="freeLine$ | async"

      (addToCartEvent)="addToCartEvent($event)"
    ></app-main-jackpot>
  `,
})
export class MainJackpotContainerComponent implements OnInit, OnDestroy {
  @Input() brandId: string;

  @Output() setMainJackpotLottery = new EventEmitter();

  aliveSubscriptions = true;

  lottery$: Observable<LotteryModel>;
  syndicate$: Observable<SyndicateModel>;
  item$: Observable<LotteryItemModel>;
  freeLine$: Observable<OfferFreeLinesInterface | null>;

  constructor(private lotteriesSortService: LotteriesSortService,
              private lotteriesService: LotteriesService,
              private cart2Service: Cart2Service,
              private cart2LotteryService: Cart2LotteryService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private offeringsService: OfferingsService,
              private syndicatesQueryService: SyndicatesQueryService,
              private lotteriesQueryService: LotteriesQueryService) {
  }

  ngOnInit(): void {
    let lotteryId$: Observable<string> = this.lotteriesSortService.getLotteriesIdsSortedList('upcoming').map(ids => ids[0]);

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.lotteriesService.getSegmentationIdsMap()
        .filter((data) => (params['lotid'] in data))
        .subscribe(data => {
          lotteryId$ = of(data[params['lotid']]);
        });
    });

    this.lottery$ = lotteryId$.switchMap((lotteryId: string) => this.lotteriesQueryService.getLotteryModelById(lotteryId));
    this.syndicate$ = lotteryId$.switchMap((lotteryId: string) => this.syndicatesQueryService.getSyndicateModelByLotteryId(lotteryId));
    this.item$ = this.getItem();
    this.freeLine$ = lotteryId$.switchMap((lotteryId: string) => this.offeringsService.getLotteryFreeLinesOffer(lotteryId));

    lotteryId$.subscribe((mainJackpotLottery: string) => this.setMainJackpotLottery.emit(mainJackpotLottery));
  }

  private getItem() {
    return combineLatest(
      this.syndicate$,
      this.lottery$
    )
      .pipe(
        first(),
        map(([syndicate, lottery]: [SyndicateModel, LotteryModel]) => {
          return {
            type: lottery ? 'lottery' : 'syndicate',
            lotteryId: lottery ? lottery.lotteryId : syndicate.lotteryId,
            name: lottery ? lottery.name : syndicate.lotteryName,
            logo: lottery ? lottery.logo : syndicate.lotteryLogo,
            slug: lottery ? lottery.slug : syndicate.lotterySlug,
            jackpot: lottery ? lottery.jackpot : syndicate.jackpot,
            minJackpot: lottery ? lottery.minJackpot : syndicate.minJackpot,
            currencyId: lottery ? lottery.currencyId : syndicate.currencyId,
            time: lottery ? lottery.lastTicketTime : syndicate.stopSellTime,
            buttonText: lottery ? 'Play and Win' : 'Join',
          };
        })
      );
  }

  addToCartEvent([lotteryId, linesAmount]): void {
    combineLatest(
      this.lotteriesService.getLottery(lotteryId),
      this.cart2Service.getItems$(),
    )
      .first()
      .takeWhile(() => this.aliveSubscriptions)
      .subscribe(([lottery, items]) => {
        const item = this.cart2LotteryService.createMinLotteryItem(lottery, items, true, linesAmount);
        this.cart2LotteryService.addItems([item]);
        this.router.navigate(['/cart']);
      });
  }

  ngOnDestroy(): void {
    this.aliveSubscriptions = false;
  }
}
