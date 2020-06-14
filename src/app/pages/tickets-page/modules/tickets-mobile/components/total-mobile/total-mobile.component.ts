import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-total-mobile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './total-mobile.component.html',
  styleUrls: ['./total-mobile.component.scss']
})
export class TotalMobileComponent {
  @Input() siteCurrencySymbol: string;
  @Input() priceTotal: number;
  @Input() discountTotal: number;
  @Input() showNumberOfOpenedFreeLines: boolean;
  @Input() numberOfOpenedFreeLines: number;

  @Output() saveToCartEvent = new EventEmitter<void>();
}
