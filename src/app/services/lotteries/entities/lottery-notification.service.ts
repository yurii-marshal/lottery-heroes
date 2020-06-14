import { Injectable } from '@angular/core';
import { LotteryNotificationInterface } from './interfaces/lottery-notification.interface';
import { BaseApiService } from '../../../modules/api/base.api.service';

@Injectable()
export class LotteryNotificationService {

  constructor(private baseApiService: BaseApiService) {
  }

  sendNotificationForm(obj: LotteryNotificationInterface) {
    return this.baseApiService.post('/customers/lottery-notifications/subscribe', obj);
  }

  confirmSubscription(token) {
    return this.baseApiService.post('/customers/lottery-notifications/confirm', token);
  }

  confirmUnSubscription(token) {
    return this.baseApiService.post('/customers/lottery-notifications/unsubscribe', token);
  }

}
