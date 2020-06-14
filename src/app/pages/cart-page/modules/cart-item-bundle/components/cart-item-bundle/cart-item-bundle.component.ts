import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {DrawsMapInterface} from '../../../../../../services/lotteries/entities/interfaces/draws-map.interface';
import {LotteriesMapInterface} from '../../../../../../services/lotteries/entities/interfaces/lotteries-map.interface';
import {CartItemPrice} from '../../../../../../services/cart2/entities/cart-item-price-map';
import {FormBuilder, FormGroup} from '@angular/forms';
import {
  OfferingsSubscriptionDiscountInterface
} from '../../../../../../modules/api/entities/incoming/offerings/offerings-subscription-discounts.interface';
import {LineInterface} from '../../../../../../modules/api/entities/outgoing/common/line.interface';
import {SyndicateModel} from '@libs/biglotteryowin-core/models/syndicate.model';
import {CartBundleItemModel} from '../../../../../../models/cart/cart-bundle-item.model';
import {BundleItemModel} from '../../../../../../models/bundle.model';

@Component({
  selector: 'app-cart-item-bundle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cart-item-bundle.component.html',
  styleUrls: ['./cart-item-bundle.component.scss']
})
export class CartItemBundleComponent implements OnChanges, OnInit {
  @Input() item: CartBundleItemModel;
  @Input() bundle: BundleItemModel;
  @Input() lotteriesMap: LotteriesMapInterface;
  @Input() upcomingDrawsMap: DrawsMapInterface;
  @Input() siteCurrencyId: string;
  @Input() renewPeriods: Array<OfferingsSubscriptionDiscountInterface>;
  @Input() itemPrice: CartItemPrice;
  @Input() syndicatesMap: { [lotteryId: string]: SyndicateModel };
  @Input() expandedLines: boolean;

  @Output() openLinesClickEvent = new EventEmitter<void>();
  @Output() closeLinesClickEvent = new EventEmitter<void>();
  @Output() renewPeriodChangeEvent = new EventEmitter<{ item: CartBundleItemModel, value: string | null }>();
  @Output() deleteItemEvent = new EventEmitter<CartBundleItemModel>();
  @Output() editLineEvent = new EventEmitter<{ item: CartBundleItemModel, editedLine: LineInterface }>();

  @ViewChild('linesListWrapper') linesListWrapper: ElementRef;
  @ViewChild('linesListBody') linesListBody: ElementRef;
  @ViewChild('buttonLineToggle') buttonLineToggle: ElementRef;
  @ViewChild('buttonLineToggleMobile') buttonLineToggleMobile: ElementRef;

  jackpot = 0;
  minJackpot = 0;
  private toggler = true;
  lotteryIds = [];

  // ng-select
  optionsList;
  customSelectForm: FormGroup;
  selectedRenewPeriod: string;

  constructor(private formBuilder: FormBuilder) {
  }

  private buildForm() {
    this.customSelectForm = this.formBuilder.group({
      'drawSelect': [{value: '', disabled: true}]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((typeof this.item !== 'undefined' && this.item !== null) &&
      (typeof this.upcomingDrawsMap !== 'undefined' && this.upcomingDrawsMap !== null)) {

      this.jackpot = this.calculateJackpot(this.item.getLotteryIds(), this.upcomingDrawsMap);
      this.minJackpot = this.calculateMinJackpot(this.item.getLotteryIds(), this.upcomingDrawsMap);

      this.selectedRenewPeriod = this.item.renewPeriod;
    }

    if (changes['renewPeriods']) {
      this.updateRenewOptionsList();
    }
  }

  ngOnInit() {
    this.selectedRenewPeriod = this.item.renewPeriod || '-';
    this.buildForm();
    if (this.expandedLines) {
      this.toggleLines();
    }
  }

  private updateRenewOptionsList() {
    this.optionsList = [{
      value: '-',
      label: 'Next 1 Draw'
    }];

    if (this.renewPeriods) {
      for (let i = 0; i < this.renewPeriods.length; i++) {
        this.optionsList.push({
          value: this.renewPeriods[i].period,
          label: 'Next ' + this.renewPeriods[i].name
        });
      }
    }
  }

  toggleLines(): void {
    if (this.toggler) {
      Velocity(this.linesListWrapper.nativeElement, 'slideDown', {display: 'flex', duration: 200});
      Velocity(this.buttonLineToggle.nativeElement, {rotateZ: '180deg'}, {duration: 200});
      Velocity(this.buttonLineToggleMobile.nativeElement, {rotateZ: '180deg'}, {duration: 200});
      this.openLinesClickEvent.emit();

      this.toggler = false;
    } else {
      Velocity(this.linesListWrapper.nativeElement, 'slideUp', {duration: 200});
      Velocity(this.buttonLineToggle.nativeElement, {rotateZ: '0deg'}, {duration: 200});
      Velocity(this.buttonLineToggleMobile.nativeElement, {rotateZ: '0deg'}, {duration: 200});
      this.closeLinesClickEvent.emit();

      this.toggler = true;
    }
  }

  calculateJackpot(lotteryIds: Array<string>, upcomingDrawsMap: DrawsMapInterface): number {
    let jackpot = 0;
    lotteryIds.forEach((lotteryId: string) => {
      jackpot += upcomingDrawsMap[lotteryId].jackpot;
    });
    return jackpot;
  }

  calculateMinJackpot(lotteryIds: Array<string>, upcomingDrawsMap: DrawsMapInterface): number {
    let minJackpot = 0;
    lotteryIds.forEach((lotteryId: string) => {
      minJackpot += upcomingDrawsMap[lotteryId].min_jackpot;
    });
    return minJackpot;
  }

  getSyndicateByTemplateId(templateId: number): SyndicateModel | undefined {
    return Object.keys(this.syndicatesMap)
      .map((lotteryId: string) => this.syndicatesMap[lotteryId])
      .find((syndicate: SyndicateModel) => syndicate.templateId === templateId);
  }
}
