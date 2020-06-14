import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ComboItemModel } from '../../../../../../models/combo.model';
import { LotteryInterface } from '../../../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import * as fromRoot from '../../../../../../store/reducers';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import * as personalResultsActions from '../../../../../../store/actions/personal-results.actions';

@Component({
  selector: 'app-offer-best-odds-combo-box',
  templateUrl: './offer-best-odds-combo-box.component.html',
  styleUrls: ['./offer-best-odds-combo-box.component.scss']
})
export class OfferBestOddsComboBoxComponent implements OnChanges, AfterViewInit {

  @Input() bestOddsCombo: ComboItemModel;
  @Input() comboLotteries: LotteryInterface[];
  @Input() boxName: string;
  @Input() boxNumber: number;

  @Output() redirectToCart = new EventEmitter();

  comboLotteryNames: string[] = [];
  showMore = false;

  constructor(private store: Store<fromRoot.State>,
              private router: Router) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['comboLotteries'] && changes['comboLotteries'].currentValue) {
      this.comboLotteries.forEach((lottery: LotteryInterface) => {
        this.comboLotteryNames.push(lottery.name);
      });
    }

    if (changes.boxNumber && changes.boxNumber.currentValue && changes.boxNumber.currentValue === 3) {
      this.boxName = 'Offer Combo - ' + this.bestOddsCombo.name;
    }
  }

  ngAfterViewInit(): void {
    this.store.dispatch(new personalResultsActions.BoxPresented({
      boxName: this.boxName, boxNumber: this.boxNumber, pageUrl: this.router.url
    }));
  }

  navigateToCart(): void {
    this.redirectToCart.emit();

    this.store.dispatch(new personalResultsActions.BoxClicked({
      boxName: this.boxName, boxNumber: this.boxNumber, pageUrl: this.router.url
    }));
  }

}
