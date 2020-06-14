import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { CustomerInterface } from '../../../../services/auth/entities/interfaces/customer.interface';
import { LotteryInterface } from '../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { DrawInterface } from '../../../../modules/api/entities/incoming/lotteries/draws.interface';
import { SubscribeLinesBoxContainerComponent } from '../../modules/subscribe-lines-box/subscribe-lines-box.container.component';
import {
  OfferBestOddsComboBoxContainerComponent
} from '../../modules/offer-best-odds-combo-box/offer-best-odds-combo-box.container.component';
import { Offer51LotteryBoxContainerComponent } from '../../modules/offer-5-1-lottery-box/offer-5-1-lottery-box.container.component';
import { BuySameLineBoxContainerComponent } from '../../modules/buy-same-line-box/buy-same-line-box.container.component';
import {
  BiggestJackpotLotteryBoxContainerComponent
} from '../../modules/biggest-jackpot-lottery-box/biggest-jackpot-lottery-box.container.component';
import { BetterOddsOfferBoxContainerComponent } from '../../modules/better-odds-offer-box/better-odds-offer-box.container.component';
import {
  RealTimeNotificationsContainerComponent
} from '../../../thank-you-page/modules/real-time-notifications/real-time-notifications-container.component';

@Component({
  selector: 'app-personal-results',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './personal-results.component.html',
  styleUrls: ['./personal-results.component.scss']
})
export class PersonalResultsComponent implements OnChanges {
  @Input() customer: CustomerInterface;
  @Input() lottery: LotteryInterface;
  @Input() draw: DrawInterface;
  @Input() customerSubscriptions: any[];
  @Input() offer51LotteryId: string;

  @ViewChild('box1', { read: ViewContainerRef }) box1ViewContainerRef: ViewContainerRef;
  @ViewChild('box2', { read: ViewContainerRef }) box2ViewContainerRef: ViewContainerRef;
  @ViewChild('box3', { read: ViewContainerRef }) box3ViewContainerRef: ViewContainerRef;

  private saleBoxes: Array<{ component: Type<any>, data: any }>;

  box1: { component: Type<any>, data: object };
  box2: { component: Type<any>, data: object };
  box3: { component: Type<any>, data: object };

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (typeof this.draw !== 'undefined' && this.draw !== null &&
        typeof this.customer !== 'undefined' && this.customer !== null &&
        (typeof this.saleBoxes === 'undefined' || !this.saleBoxes)) {
      this.saleBoxes = this.getSaleBoxes();
    }

    if (changes.customer && changes.customer.currentValue && this.box1 && this.box2 && this.box3) {
      this.renderBox2();

      if (this.box2.component === this.box3.component) {
        this.renderBox3();
      }
    }

    if (!this.box1 || !this.box2 || !this.box3) {
      this.renderBox1();
      this.renderBox2();
      this.renderBox3();
    }
  }

  private renderBox(box: { component: Type<any>, data: object }, viewContainerRef: ViewContainerRef): void {
    if (!box) {
      return;
    }

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(box.component);
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    const simpleChanges: SimpleChanges = {};
    Object.keys(box.data).forEach((key: string) => {
      componentRef.instance[key] = box.data[key];
      simpleChanges[key] = new SimpleChange(undefined, box.data[key], true);
    });
    if (typeof componentRef.instance.ngOnChanges !== 'undefined') {
      componentRef.instance.ngOnChanges(simpleChanges);
    }
  }

  private renderBox1(): void {
    if (typeof this.lottery === 'undefined' || !this.lottery || typeof this.saleBoxes === 'undefined') {
      return null;
    }

    const isSubscribed = this.isSubscribed(this.lottery.id);

    if (isSubscribed === null) {
      return null;
    }

    if (this.lottery.id !== 'euromillions' && this.lottery.id !== 'euromillions-ie' && !isSubscribed) {
     const boxes = this.saleBoxes.filter(_box => {
       return _box.component === SubscribeLinesBoxContainerComponent ||
         _box.component === BuySameLineBoxContainerComponent;
     });

     this.box1 = boxes[this.getRandomNumber(0, 1)];
     this.deleteBoxFromArray(this.box1);
    } else {
      this.box1 = this.saleBoxes.find(_box => _box.component === OfferBestOddsComboBoxContainerComponent);
      this.deleteBoxFromArray(this.box1);
    }

    this.box1.data['boxNumber'] = 1;

    this.renderBox(this.box1, this.box1ViewContainerRef);
  }

  private renderBox2(): void {
    if (typeof this.box1 === 'undefined' || !this.box1 || typeof this.customer === 'undefined' || !this.customer) {
      return null;
    }

    if (!this.customer.mobile || typeof this.customer.mobile === 'undefined') {
      this.box2 = this.saleBoxes.find(_box => _box.component === RealTimeNotificationsContainerComponent);
      this.deleteBoxFromArray(this.box2);
    } else if (this.box1.component !== OfferBestOddsComboBoxContainerComponent) {
      this.box2 = this.saleBoxes.find(_box => _box.component === OfferBestOddsComboBoxContainerComponent);
      this.deleteBoxFromArray(this.box2);
    } else {
      this.box2 = this.saleBoxes.find(_box => _box.component === BiggestJackpotLotteryBoxContainerComponent);
      this.deleteBoxFromArray(this.box2);
    }

    this.box2.data['boxNumber'] = 2;

    this.renderBox(this.box2, this.box2ViewContainerRef);
  }

  private renderBox3(): void {
    if (typeof this.saleBoxes === 'undefined' || typeof this.box2 === 'undefined' || !this.box2) {
      return null;
    }

    this.box3 = this.saleBoxes[this.getRandomNumber(0, this.saleBoxes.length - 1)];
    this.box3.data['boxNumber'] = 3;

    this.renderBox(this.box3, this.box3ViewContainerRef);
  }

  private isSubscribed(lotteryId: string): boolean | null {
    if (typeof lotteryId === 'undefined' || lotteryId === null ||
        typeof this.customerSubscriptions === 'undefined' || !this.customerSubscriptions) {
      return null;
    }

    return this.customerSubscriptions.some(subscription => {
      return subscription.items_json.lines[0].lottery_id === lotteryId;
    });
  }

  private deleteBoxFromArray(box: { component: Type<any>, data: object }): void {
    const index = this.saleBoxes.indexOf(box);
    this.saleBoxes.splice(index, 1);
  }

  private getSaleBoxes(): Array<{ component: Type<any>, data: object }> {
    const saleBoxes: Array<{ component: Type<any>, data: object }> = [
      { component: BuySameLineBoxContainerComponent, data: { draw: this.draw, boxName: 'Same Numbers For Next Draw' } },
      { component: SubscribeLinesBoxContainerComponent, data: { draw: this.draw, boxName: 'Subscription With Last Numbers' } },
      { component: BetterOddsOfferBoxContainerComponent, data: { draw: this.draw, boxName: 'Lottery With Best Odds' } },
      { component: BiggestJackpotLotteryBoxContainerComponent, data: { draw: this.draw, boxName: 'Biggest Jackpot Offer' } },
      { component: OfferBestOddsComboBoxContainerComponent, data: { boxName: 'Best Odds Combo' } }
    ];

    if (typeof this.customer !== 'undefined' && this.customer && !this.customer.mobile) {
      saleBoxes.push({ component: RealTimeNotificationsContainerComponent, data: { boxName: 'Enter Mobile Number' } });
    }

    if (this.offer51LotteryId) {
      saleBoxes.push({ component: Offer51LotteryBoxContainerComponent, data: { draw: this.draw, boxName: 'Offer 5+1 Deal - ' } });
    }

    return saleBoxes;
  }

  private getRandomNumber(min, max): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
