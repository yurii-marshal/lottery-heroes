import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { OfferingsService } from '../../../../../services/offerings/offerings.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Cart2Service } from '../../../../../services/cart2/cart2.service';
import { Cart2LotteryService } from '../../../../../services/cart2/cart2-lottery.service';
import { LotteriesService } from '../../../../../services/lotteries/lotteries.service';
import { LotteryInterface } from '../../../../api/entities/incoming/lotteries/lotteries.interface';
import { DrawInterface } from '../../../../api/entities/incoming/lotteries/draws.interface';
import { OfferFreeLinesInterface } from '../../../../api/entities/incoming/offerings/offerings-offers.interface';
import { combineLatest } from 'rxjs/observable/combineLatest';

@Component({
  selector: 'app-lottery-with-greatest-jackpot-dropdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lottery-with-greatest-jackpot-dropdown.component.html',
  styleUrls: ['./lottery-with-greatest-jackpot-dropdown.component.scss']
})
export class LotteryWithGreatestJackpotDropdownComponent implements OnDestroy, OnChanges {
  @Input() lottery: LotteryInterface;
  @Input() upcomingDraw: DrawInterface;
  @Input() freeLineOffer: OfferFreeLinesInterface;

  @Output() oTrackQuickPickClicked = new EventEmitter<{ lotteryName: string, menuName: string }>();
  @Output() oTrackHandPickNumbersClicked = new EventEmitter<{ lotteryName: string, menuName: string }>();

  aliveSubscriptions = true;
  isfreeLine: boolean;
  lineToQualify: number;
  linesFree: number;
  linesAmount: number;
  ribbonText: string;
  isShowRibbon: boolean;
  freeLineClass: string;
  lotteryLinePrice$: Observable<number>;
  lotterySlug: string;

  constructor(private lotteriesService: LotteriesService,
              private cart2Service: Cart2Service,
              private cart2LotteryService: Cart2LotteryService,
              private offeringsService: OfferingsService,
              private router: Router) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.lottery && changes.lottery.currentValue && changes.upcomingDraw && changes.upcomingDraw.currentValue) {
      this.lotteryLinePrice$ = this.offeringsService.getPrices()
        .map(offeringsPrices => OfferingsService.findLotteryLinePrice(offeringsPrices, this.lottery.id, this.upcomingDraw.id));

      this.lotterySlug = this.lotteriesService.getSlugByLottery(this.lottery);
    }

    this.getFreeLineOfferProperties();
  }

  getFreeLineOfferProperties() {
    if (this.freeLineOffer) {
      this.isfreeLine = true;
      this.lineToQualify = this.freeLineOffer.details.lines_to_qualify;
      this.linesFree = this.freeLineOffer.details.lines_free;
      this.linesAmount = this.freeLineOffer.details.lines_to_qualify;
      this.isShowRibbon = this.freeLineOffer.display_properties.ribbon_lotteries_page;
      this.ribbonText = this.freeLineOffer.display_properties.short_text;
      this.freeLineClass = this.freeLineOffer.display_properties.ribbon_css_class;
    } else {
      this.linesAmount = 4;
    }
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

    this.oTrackQuickPickClicked.emit({ lotteryName: this.lottery.name, menuName: 'single lottery' });
  }

  ngOnDestroy(): void {
    this.aliveSubscriptions = false;
  }
}
