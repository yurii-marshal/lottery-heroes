import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { MetaService } from '../../modules/meta/services/meta.service';
import { AnalyticsDeprecatedService } from '../../modules/analytics-deprecated/services/analytics-deprecated.service';
import { ComboItemModel } from '../../models/combo.model';
import { CombosService } from '../../services/combos/combos.service';
import { CustomerService } from '../../services/auth/customer.service';
import { Observable } from 'rxjs/Observable';
import { CustomerInterface } from '../../services/auth/entities/interfaces/customer.interface';
import { AuthService } from '../../services/auth/auth.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../store/reducers/index';
import { CartStoreInterface } from '../../store/entities/cart-store.interface';

@Component({
  selector: 'app-thank-you-page-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-thank-you-page
      [lastOrdered]="lastOrdered$|async"
      [combosList]="combosList$|async"
      [customer]="customer$|async"
    ></app-thank-you-page>
  `
})
export class ThankYouPageContainerComponent implements OnInit {
  lastOrdered$: Observable<CartStoreInterface | null>;
  combosList$: Observable<ComboItemModel[]>;
  customer$: Observable<CustomerInterface>;

  constructor(private store: Store<fromRoot.State>,
              private metaService: MetaService,
              private analyticsDeprecatedService: AnalyticsDeprecatedService,
              private combosService: CombosService,
              private customerService: CustomerService,
              private authService: AuthService) {
    this.lastOrdered$ = this.store.select(fromRoot.getCartLastOrdered);
    this.combosList$ = this.combosService.getSortedByPriorityDisplayedCombosList('thank-you').map(combos => combos.slice(0, 5));
    this.customer$ = this.customerService.getCustomer();
  }

  ngOnInit() {
    this.metaService.setFromConfig('page', 'thank-you');
    this.authService.getCurrentCustomer().subscribe(
      customer => this.authService.saveCurrentUserObj(customer),
    );
  }
}
