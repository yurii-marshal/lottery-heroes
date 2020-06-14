import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OfferingsService } from '../../../services/offerings/offerings.service';
import { OfferingsPricesMapInterface } from '../../../services/api/entities/incoming/offerings/offerings-prices.interface';
import { LotteryInterface } from '../../api/entities/incoming/lotteries/lotteries.interface';
import { DrawInterface } from '../../api/entities/incoming/lotteries/draws.interface';
import { OfferFreeLinesInterface } from '../../api/entities/incoming/offerings/offerings-offers.interface';

@Component({
  selector: 'app-lottery-widgets-before-cutoff-container',
  template: `<app-lottery-widgets-before-cutoff
              *ngIf="isCutoffLightBoxShown"

							[lottery]="lottery"
							[upcomingDraw]="upcomingDraw"
							[isFreeLine]="isFreeLine"
							[lineToQualify]="lineToQualify"
							[linesFree]="linesFree"
							[lotteryLinePrice]="lotteryLinePrice"
							[defaultNumberOfLines]="defaultNumberOfLines"

              (closeCutoffLightBox)="closeCutoffLightBox($event)"
              (addDefiniteItemsToCartEvent)="addDefiniteItemsToCartEvent.emit($event)"
            ></app-lottery-widgets-before-cutoff>`
})
export class LotteryWidgetsBeforeCutoffContainerComponent implements OnInit {
  @Input() freeLinesOffer: OfferFreeLinesInterface;
  @Input() offeringsPricesMap: OfferingsPricesMapInterface;
  @Input() lottery: LotteryInterface;
  @Input() upcomingDraw: DrawInterface;
  @Input() defaultNumberOfLines: number;

  @Output() addDefiniteItemsToCartEvent = new EventEmitter();

  isCutoffLightBoxShown = false;
  isFreeLine: boolean;
  lineToQualify: number;
  linesFree: number;
  lotteryLinePrice: number;

  constructor() { }

  ngOnInit() {
    if (this.freeLinesOffer) {
      this.isFreeLine = true;
      this.lineToQualify = this.freeLinesOffer.details.lines_to_qualify;
      this.linesFree = this.freeLinesOffer.details.lines_free;
    }

    this.getLotteryLinePrice();
    this.showCutOfTimeLightBox();
  }

  getLotteryLinePrice() {
    this.lotteryLinePrice = OfferingsService.findLotteryLinePrice(this.offeringsPricesMap, this.lottery.id, this.upcomingDraw.id);
  }

  showCutOfTimeLightBox() {
    const date = new Date();
    const date_cutOff = new Date(this.upcomingDraw.last_ticket_time);
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).valueOf();
    const cutoff = new Date(date_cutOff.getFullYear(), date_cutOff.getMonth(), date_cutOff.getDate()).valueOf();

    if (today === cutoff) {
      if (date_cutOff.getTime() - date.getTime() < 3600000 && date_cutOff.getTime() - date.getTime() > 0) {
        this.isCutoffLightBoxShown = true;
      } else {
        this.isCutoffLightBoxShown = false;
      }
    }
  }

  closeCutoffLightBox() {
    this.isCutoffLightBoxShown = false;
  }
}
