import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { LotteryInterface } from '../../../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { DrawInterface } from '../../../../../../modules/api/entities/incoming/lotteries/draws.interface';
import { LineInterface } from '../../../../../../modules/api/entities/outgoing/common/line.interface';
import * as personalResultsActions from '../../../../../../store/actions/personal-results.actions';
import * as fromRoot from '../../../../../../store/reducers';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { OfferFreeLinesInterface } from '../../../../../../modules/api/entities/incoming/offerings/offerings-offers.interface';

@Component({
  selector: 'app-offer-5-1-lottery-box',
  templateUrl: './offer-5-1-lottery-box.component.html',
  styleUrls: ['./offer-5-1-lottery-box.component.scss']
})
export class Offer51LotteryBoxComponent implements AfterViewInit {

  @Input() lottery: LotteryInterface;
  @Input() freeLineOffer: OfferFreeLinesInterface;
  @Input() upcomingDraw: DrawInterface;
  @Input() upcomingDrawLinePrice: number;
  @Input() lines: LineInterface[];
  @Input() boxName: string;
  @Input() boxNumber: number;

  @Output() redirectToCart = new EventEmitter();

  constructor(private store: Store<fromRoot.State>,
              private router: Router) {}

  ngAfterViewInit(): void {
    this.store.dispatch(new personalResultsActions.BoxPresented({
      boxName: this.boxName + this.lottery.name, boxNumber: this.boxNumber, pageUrl: this.router.url
    }));
  }

  navigateToCart(event): void {
    this.redirectToCart.emit(event);

    this.store.dispatch(new personalResultsActions.BoxClicked({
      boxName: this.boxName + this.lottery.name, boxNumber: this.boxNumber, pageUrl: this.router.url
    }));
  }
}
