import { Injectable } from '@angular/core';
import { DeviceService } from '../../../services/device/device.service';
import { AccountService } from '../../../services/account/account.service';
import { LuckyNumbersService } from '../../../services/lotteries/lucky-numbers.service';
import { Observable } from 'rxjs/Observable';
import {
  LuckyNumbersItemInterface
} from '../../../services/api/entities/incoming/lotteries/lucky-numbers.interface';
import { AnalyticsDeprecatedService } from '../../../modules/analytics-deprecated/services/analytics-deprecated.service';
import { LightboxesService } from '../../../modules/lightboxes/services/lightboxes.service';

@Injectable()
export class MyLuckyNumbersSandbox {

  constructor(private deviceService: DeviceService,
              private accountService: AccountService,
              private analyticsDeprecatedService: AnalyticsDeprecatedService,
              private luckyNumbersService: LuckyNumbersService,
              private lightboxesService: LightboxesService) {
  }

  getDevice$() {
    return this.deviceService.getDevice();
  }

  onBackToMenu() {
    this.accountService.emitClick('from-back');
  }

  getEditLuckyNumbers(): Observable<LuckyNumbersItemInterface[]> {
    return this.luckyNumbersService.getEditLuckyNumbers();
  }

  getEditNewLuckyNumbers() {
    return this.luckyNumbersService.getEditNewLuckyNumbers();
  }

  addNewEmptyGroup() {
    this.luckyNumbersService.addNewEmptyGroup();
  }

  removeNewGroup(index: number) {
    this.luckyNumbersService.removeNewGroup(index);
  }

  removeOldGroup(index: number) {
    this.luckyNumbersService.removeOldGroup(index);
  }

  storeOldGroup({group, index}: {group: LuckyNumbersItemInterface, index: number}) {
    this.luckyNumbersService.storeOldGroups({group: group, index: index});
  }

  storeNewGroup({group, index}: {group: LuckyNumbersItemInterface, index: number}) {
    this.luckyNumbersService.storeNewGroup({group: group, index: index});
  }

  clearStoredGroups() {
    this.luckyNumbersService.onCancelClicked();
  }

  showSaveLightbox() {
    this.lightboxesService.show({
      type: 'general',
      title: 'Confirmation',
      message: 'Are you sure you want to save changes?',
      buttons: [
        {
          text: 'Cancel',
          type: 'cancel'
        },
        {
          text: 'Save',
          type: 'save',
          handler: () => {
            this.getSaveModalClickedEvent().emit();
          }
        }
      ]
    });
  }

  showRemoveLightbox({type: type, index: index}) {
    this.lightboxesService.show({
      type: 'general',
      title: '',
      message: 'Are you sure you want to delete these lucky numbers?',
      buttons: [
        {
          text: 'Yes',
          type: 'save',
          handler: () => {
            switch (type) {
              case 'old':
                this.removeOldGroup(index);
                break;
              case 'new':
                this.removeNewGroup(index);
                break;
            }
          }
        },
        {
          text: 'No',
          type: 'cancel'
        }
      ]
    });
  }

  // Get events$
  getCancelClickedEvent() {
    return this.luckyNumbersService.onCancelEvent$;
  }

  getSaveClickedEvent() {
    return this.luckyNumbersService.onSaveEvent$;
  }

  getShowRemoveModalEvent() {
    return this.luckyNumbersService.showRemoveModalEvent$;
  }

  getShowSaveModalEvent() {
    return this.luckyNumbersService.showSaveModalEvent$;
  }

  getSaveModalClickedEvent() {
    return this.luckyNumbersService.onSaveModalEvent$;
  }

  getStoreGroupsEvent() {
    return this.luckyNumbersService.storeGroupsEvent$;
  }

  // analytics-deprecated
  onTrackLuckyNumbersEditClicked() {
    this.analyticsDeprecatedService.trackLuckyNumbersEditClicked();
  }

  onTrackNewLuckyNumber(value: string) {
    this.analyticsDeprecatedService.trackNewLuckyNumber(value);
  }

  onTrackLuckyNumberDeleteLine(lineOrder: number) {
    this.analyticsDeprecatedService.trackLuckyNumberDeleteLine(lineOrder);
  }
}
