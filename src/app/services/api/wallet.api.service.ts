import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BaseSecureApiService } from './base-secure.api.service';

import { BalanceInterface, BalanceResponseInterface } from './entities/incoming/wallet/balance.interface';
import { CustomerCardInterface } from './entities/incoming/wallet/customer-card.interface';
import { HttpParams } from '@angular/common/http';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Injectable()
export class WalletApiService {

  constructor(private baseSecureApiService: BaseSecureApiService) {
  }

  deposit(body) {
    return this.baseSecureApiService.post('/wallet/deposit/', JSON.stringify(body))
      .catch(error => ErrorObservable.create(error));
  }

  buy(body) {
    return this.baseSecureApiService.post('/wallet/buy/', JSON.stringify(body))
      .catch(error => ErrorObservable.create(error));
  }

  depositAndBuy(body) {
    return this.baseSecureApiService.post('/wallet/deposit-and-buy/', JSON.stringify(body))
      .catch(error => ErrorObservable.create(error));
  }

  getCustomerTransactions(body) {
    return this.baseSecureApiService.get('/wallet/transactions/', body)
      .map(res => res.transactions);
  }

  getOrders(limit = 30, status?: string): Observable<any[]> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('limit', limit.toString());

    if (typeof status !== 'undefined') {
      httpParams = httpParams.set('status', status);
    }

    return this.baseSecureApiService.get('/wallet/orders/', httpParams)
      .map(res => res.orders);
  }

  getCustomerBalance(): Observable<BalanceInterface> {
    return this.baseSecureApiService.get('/wallet/balance/')
      .map((response: BalanceResponseInterface) => response.balance);
  }

  customerWithdraw(body) {
    return this.baseSecureApiService.post('/wallet/withdraw/', JSON.stringify(body))
      .catch(error => ErrorObservable.create(error.json()));
  }

  getCustomerDepositLimits() {
    return this.baseSecureApiService.get('/wallet/deposit-limits/')
      .map(res => res.limits[0]);
  }

  customerDepositeLimitsUpdate(body) {
    return this.baseSecureApiService.put('/wallet/deposit-limits/', JSON.stringify(body))
      .catch(error => ErrorObservable.create(error.json()));
  }

  getTransactionsCount(body) {
    return this.baseSecureApiService.get('/wallet/transactions/count/', body);
  }

  getCustomerCards(body): Observable<CustomerCardInterface[]> {
    return this.baseSecureApiService.get('/wallet/customer-cards/', body)
      .map(res => res.cards);
  }

  getCustomerSubscriptions(): Observable<any> {
    return this.baseSecureApiService.get('/wallet/subscriptions/');
  }

  getCustomerSubscriptionById(id): Observable<any> {
    return this.baseSecureApiService.get('/wallet/subscriptions/' + id);
  }

  cancelCustomerSubscriptionById(id): Observable<any> {
    return this.baseSecureApiService.post('/wallet/subscriptions/cancel/' + id, '');
  }
}
