import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-approximately-currency-info',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './approximately-currency-info.component.html',
  styleUrls: ['./approximately-currency-info.component.scss']
})
export class ApproximatelyCurrencyInfoComponent {
  @Input() jackpot: number;
  @Input() siteCurrencyId: string;
  @Input() currencyRate: number;
}
