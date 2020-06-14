import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { LuvService } from '../../../../services/luv.service';
import { CurrencyService } from '../../../../services/auth/currency.service';

@Component({
  selector: 'app-approximately-currency-info-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-approximately-currency-info
              [jackpot]="jackpot"
              [siteCurrencyId]="siteCurrencyId$|async"
              [currencyRate]="currencyRate$|async"
             ></app-approximately-currency-info>`
})
export class ApproximatelyCurrencyInfoContainerComponent implements OnInit {
  @Input() jackpot: number;
  @Input() currencyId: string;
  siteCurrencyId$: Observable<string>;
  currencyRate$: Observable<number>;

  constructor(private currencyService: CurrencyService,
              private luvService: LuvService) {
  }

  ngOnInit() {
    this.siteCurrencyId$ = this.currencyService.getCurrencyId();
    this.currencyRate$ = this.getRate();
  }

  getRate(): Observable<any> {
    return this.luvService.getCurrencyRates()
      .filter(currency_rates => !!currency_rates)
      .map((currency_rates) => (currency_rates.filter(rateItem => rateItem.id === this.currencyId))[0].rate);
  }
}
