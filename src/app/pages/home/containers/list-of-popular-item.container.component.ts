import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { LotteriesService } from '../../../services/lotteries/lotteries.service';

import { combineLatest } from 'rxjs/observable/combineLatest';
import { first, map } from 'rxjs/operators';

import { OfferingsService } from '../../../services/offerings/offerings.service';
import { Cart2Service } from '../../../services/cart2/cart2.service';
import { Cart2LotteryService } from '../../../services/cart2/cart2-lottery.service';
import { SyndicatesQueryService } from '@libs/biglotteryowin-core/services/queries/syndicates-query.service';
import { LotteriesQueryService } from '@libs/biglotteryowin-core/services/queries/lotteries-query.service';

import { OfferFreeLinesInterface } from '../../../modules/api/entities/incoming/offerings/offerings-offers.interface';
import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';
import { LotteryModel } from '@libs/biglotteryowin-core/models/lottery.model';
import { LotteryItemModel } from '../components/list-of-popular/lottery-item.model';

@Component({
  selector: 'app-list-of-popular-item-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-list-of-popular-item
      [item]="item$|async"
      [position]="position"
      [freeLineOffer]="freeLineOffer$|async"

      (addToCartEvent)="addToCartEvent($event)"
    ></app-list-of-popular-item>`,
})
export class ListOfPopularItemContainerComponent implements OnInit, OnDestroy {
  @Input() position: number;
  @Input() lotteryId: string;

  aliveSubscriptions = true;

  item$: Observable<LotteryItemModel>;
  freeLineOffer$: Observable<OfferFreeLinesInterface | null>;

  constructor(private lotteriesService: LotteriesService,
              private offeringsService: OfferingsService,
              private cart2Service: Cart2Service,
              private cart2LotteryService: Cart2LotteryService,
              private router: Router,
              private syndicatesQueryService: SyndicatesQueryService,
              private lotteriesQueryService: LotteriesQueryService) {
  }

  ngOnInit() {
    this.item$ = this.getItem();
    this.freeLineOffer$ = this.offeringsService.getLotteryFreeLinesOffer(this.lotteryId);
  }

  private getItem() {
    return combineLatest(
      this.syndicatesQueryService.getSyndicateModelByLotteryId(this.lotteryId),
      this.lotteriesQueryService.getLotteryModelById(this.lotteryId)
    )
      .pipe(
        first(),
        map(([syndicate, lottery]: [SyndicateModel, LotteryModel]) => {
          return {
            type: lottery.isSold ? 'lottery' : 'syndicate',
            lotteryId: lottery ? lottery.lotteryId : syndicate.lotteryId,
            name: lottery ? lottery.name : syndicate.lotteryName,
            logo: lottery ? lottery.logo : syndicate.lotteryLogo,
            slug: lottery ? lottery.slug : syndicate.lotterySlug,
            jackpot: lottery ? lottery.jackpot : syndicate.jackpot,
            minJackpot: lottery ? lottery.minJackpot : syndicate.minJackpot,
            currencyId: lottery ? lottery.currencyId : syndicate.currencyId,
            time: lottery ? lottery.lastTicketTime : syndicate.stopSellTime,
            buttonText: lottery.isSold ? 'Play now' : 'Join',
            numLines: syndicate ? syndicate.numLines : null,
            numShares: syndicate ? syndicate.numShares : null
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
