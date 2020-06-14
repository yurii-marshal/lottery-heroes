import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CartSyndicateItemModel } from '../../../../../../models/cart/cart-syndicate-item.model';
import { CartItemPrice } from '../../../../../../services/cart2/entities/cart-item-price-map';
import { LotteryInterface } from '../../../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { AltService } from '../../../../../../services/lotteries/alt.service';
import { DrawInterface } from '../../../../../../modules/api/entities/incoming/lotteries/draws.interface';
import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';
import { LotteriesService } from '../../../../../../services/lotteries/lotteries.service';

@Component({
  selector: 'app-cart-item-syndicate',
  templateUrl: './cart-item-syndicate.component.html',
  styleUrls: ['./cart-item-syndicate.component.scss']
})
export class CartItemSyndicateComponent implements OnInit, OnChanges {
  @Input() item: CartSyndicateItemModel;
  @Input() itemPrice: CartItemPrice;
  @Input() currencyId: string;
  @Input() syndicateTemplate: SyndicateModel;
  @Input() lottery: LotteryInterface;
  @Input() upcomingDraw: DrawInterface;
  @Input() expandedLines: boolean;

  @Output() deleteItemEvent = new EventEmitter<CartSyndicateItemModel>();
  @Output() addShare = new EventEmitter<number>();
  @Output() removeShare = new EventEmitter<number>();
  @Output() setShares = new EventEmitter<{ templateId: number, numShares: number }>();

  @ViewChild('linesListWrapper') linesListWrapper: ElementRef;
  @ViewChild('buttonLineToggle') buttonLineToggle: ElementRef;
  @ViewChild('inputShareNumber') inputShareNumber: ElementRef;
  @ViewChild('buttonLineToggleMobile') buttonLineToggleMobile: ElementRef;
  @ViewChild('inputShareNumberMobile') inputShareNumberMobile: ElementRef;

  private toggler = true;

  altName: string;
  lotterySlug = '';

  constructor(private altService: AltService,
              private lotteriesService: LotteriesService) {}

  ngOnInit(): void {
    if (this.expandedLines) {
      this.toggleLines();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lottery'] && changes['lottery'].currentValue) {
      this.altName = this.altService.getAlt(this.lottery.id);
      this.lotterySlug = this.lotteriesService.getSlugByLottery(this.lottery);
    }
  }

  toggleLines(): void {
    if (this.toggler) {
      Velocity(this.linesListWrapper.nativeElement, 'slideDown', {display: 'flex', duration: 200});
      Velocity(this.buttonLineToggle.nativeElement, {rotateZ: '180deg'}, {duration: 200});
      Velocity(this.buttonLineToggleMobile.nativeElement, {rotateZ: '180deg'}, {duration: 200});
      this.toggler = false;
    } else {
      Velocity(this.linesListWrapper.nativeElement, 'slideUp', {duration: 200});
      Velocity(this.buttonLineToggle.nativeElement, {rotateZ: '0deg'}, {duration: 200});
      Velocity(this.buttonLineToggleMobile.nativeElement, {rotateZ: '0deg'}, {duration: 200});
      this.toggler = true;
    }
  }

  onInputMaxCheck(value: number) {
    if (value > this.syndicateTemplate.numSharesAvailable) {
      this.inputShareNumber.nativeElement.value = this.syndicateTemplate.numSharesAvailable;
      this.inputShareNumberMobile.nativeElement.value = this.syndicateTemplate.numSharesAvailable;
    }
  }
}
