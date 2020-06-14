import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../../services/auth/customer.service';
import { Observable } from 'rxjs/Observable';
import { CustomerInterface } from '../../../../services/auth/entities/interfaces/customer.interface';

@Component({
  selector: 'app-list-of-options-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-list-of-options
      [customer]="customer$|async"
    ></app-list-of-options>`
})
export class ListOfOptionsContainerComponent implements OnInit {
  customer$: Observable<CustomerInterface>;

  constructor(private customerService: CustomerService) {
  }

  ngOnInit(): void {
    this.customer$ = this.customerService.getCustomer();
  }
}
