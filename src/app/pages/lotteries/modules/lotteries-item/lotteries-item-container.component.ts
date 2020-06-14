import { ChangeDetectionStrategy, Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map } from 'rxjs/operators';

import { inArrayHelper } from '@libs/biglotteryowin-core/helpers';
import { SyndicatesQueryService } from '@libs/biglotteryowin-core/services/queries/syndicates-query.service';
import { LotteriesQueryService } from '@libs/biglotteryowin-core/services/queries/lotteries-query.service';

import { LOTTERIES_ITEM_CONFIG } from './configs/lotteries-item.config';
import { LotteriesService } from '../../../../services/lotteries/lotteries.service';
import { DrawsService } from '../../../../services/lotteries/draws.service';
import { OfferingsService } from '../../../../services/offerings/offerings.service';
import { CurrencyService } from '../../../../services/auth/currency.service';
import { Cart2Service } from '../../../../services/cart2/cart2.service';
import { Cart2LotteryService } from '../../../../services/cart2/cart2-lottery.service';
import { LotteriesItemModel } from './models/lotteries-item.model';

@Component({
  selector: 'app-lotteries-item-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-lotteries-item
      [item]="item$|async"
      (addToCartEvent)="onAddToCartEvent($event)"
    ></app-lotteries-item>
  `
})
export class LotteriesItemContainerComponent implements OnInit {
  @Input() position: number;
  @Input() lotteryId: string;

  item$: Observable<LotteriesItemModel>;

  constructor(private lotteriesService: LotteriesService,
              private lotteriesQueryService: LotteriesQueryService,
              private syndicateQueryService: SyndicatesQueryService,
              private drawsService: DrawsService,
              private offeringsService: OfferingsService,
              private currencyService: CurrencyService,
              private cart2Service: Cart2Service,
              private cart2LotteryService: Cart2LotteryService,
              private router: Router,
              @Inject(LOTTERIES_ITEM_CONFIG) private lotteriesItemConfig: {[key: string]: any}) {
  }

  ngOnInit(): void {
    this.item$ = combineLatest(
      this.lotteriesQueryService.getLotteryModelById(this.lotteryId),
      this.syndicateQueryService.getSyndicateModelByLotteryId(this.lotteryId),
    ).pipe(
      map(([lottery, syndicate]) => {
        if (typeof lottery !== 'undefined' && lottery.isSold === true) {
          return new LotteriesItemModel(
            'lottery',
            this.position,
            lottery.lotteryId,
            lottery.slug,
            lottery.name,
            lottery.logo,
            lottery.jackpot,
            lottery.minJackpot,
            lottery.currencyId,
            lottery.lastTicketTime,
            inArrayHelper(this.lotteriesItemConfig['significantLinkLotteryIds'], lottery.lotteryId),
            lottery.freeLinesOffer,
          );
        } else if (typeof syndicate !== 'undefined') {
          return new LotteriesItemModel(
            'syndicate',
            this.position,
            syndicate.lotteryId,
            syndicate.lotterySlug,
            syndicate.lotteryName,
            syndicate.lotteryLogo,
            syndicate.jackpot,
            syndicate.minJackpot,
            syndicate.currencyId,
            syndicate.stopSellTime,
            inArrayHelper(this.lotteriesItemConfig['significantLinkLotteryIds'], syndicate.lotteryId),
            undefined,
            syndicate.numLines,
            syndicate.numShares
          );
        } else {
          throw new Error(`No lottery and no syndicate with id: ${this.lotteryId}`);
        }
      })
    );
  }

  onAddToCartEvent({lotteryId, linesNumber}: {lotteryId: string, linesNumber: number}): void {
    combineLatest(
      this.lotteriesService.getLottery(lotteryId),
      this.cart2Service.getItems$(),
    )
      .first()
      .subscribe(([lottery, items]) => {
        const item = this.cart2LotteryService.createMinLotteryItem(lottery, items, true, linesNumber);
        this.cart2LotteryService.addItems([item]);
        this.router.navigate(['/cart']);
      });
  }
}
