import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {CustomerInterface} from './entities/interfaces/customer.interface';
import {WindowService} from '../device/window.service';

@Injectable()
export class CustomerService {
  private customerSubject$: BehaviorSubject<CustomerInterface>;

  constructor(private winRef: WindowService) {
    this.customerSubject$ = new BehaviorSubject(null);
  }

  getCustomer(): Observable<CustomerInterface> {
    return this.customerSubject$.asObservable();
  }

  setCustomer(customer: CustomerInterface) {
    if (this.customerSubject$.getValue() && customer) {
      this.customerSubject$.next(Object.assign({}, customer));
    } else {
      this.customerSubject$.next(customer);
    }
  }

  getCustomerStatusId(): Observable<any> {
    return this.customerSubject$.asObservable()
      .filter((customer: CustomerInterface) => !!customer)
      .map((customer: CustomerInterface) => customer.status_id);
  }
}
