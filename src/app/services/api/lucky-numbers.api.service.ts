import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  LuckyNumbersCreateGroupsInterface, LuckyNumbersGroupInterface,
  LuckyNumbersGroupsInterface, LuckyNumbersItemInterface
} from './entities/incoming/lotteries/lucky-numbers.interface';
import { BaseSecureApiService } from './base-secure.api.service';

@Injectable()
export class LuckyNumbersApiService {

  constructor(private baseSecureApiService: BaseSecureApiService) {
  }

  getGroups(): Observable<LuckyNumbersGroupsInterface> {
    return this.baseSecureApiService.get('/customers/lucky-numbers');
  }

  updateGroup(groupId: string, group: LuckyNumbersItemInterface): Observable<LuckyNumbersGroupInterface> {
    return this.baseSecureApiService.put('/customers/lucky-numbers/' + groupId, JSON.stringify(group));
  }

  updateGroups(groups: LuckyNumbersCreateGroupsInterface) {
    return this.baseSecureApiService.put('/customers/lucky-numbers/', JSON.stringify(groups));
  }

  deleteGroup(groupId: string) {
    return this.baseSecureApiService.delete('/customers/lucky-numbers/' + groupId);
  }

  // deleteGroups(deleteGroups: Array<string>) {
  //   return this.baseSecureApiService.delete('/customers/lucky-numbers/', JSON.stringify({groups: deleteGroups}));
  // }

  createGroup(groups: LuckyNumbersCreateGroupsInterface | LuckyNumbersItemInterface) {
    return this.baseSecureApiService.post('/customers/lucky-numbers', JSON.stringify(groups));
  }

}
