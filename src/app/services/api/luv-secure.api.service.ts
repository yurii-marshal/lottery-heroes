import { Injectable } from '@angular/core';
import { BaseSecureApiService } from './base-secure.api.service';

@Injectable()
export class LuvSecureApiService {

  constructor(private baseSecureApiService: BaseSecureApiService) {}

  getPaymentSystems() {
    return this.baseSecureApiService.get('/luv/payment-systems/')
      .map(res => res.payment_systems);
  }
}
