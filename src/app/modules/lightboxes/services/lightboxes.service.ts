import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class LightboxesService {
  private showLightbox = new EventEmitter();
  private closeAllLightboxes = new EventEmitter();

  show(data: any) {
    this.showLightbox.emit(data);
  }

  getShowEventEmitter() {
    return this.showLightbox;
  }

  getCloseAllEventEmitter() {
    return this.closeAllLightboxes;
  }

  //
  // TODO move title & message into payload
  // TODO make classes for btns
  //
  // Example
  // this.lightboxesService.show({
  //   type: 'general',
  //   title: 'Lucky numbers title',
  //   payload: {},
  //   message: 'Are you sure you want to delete these lucky numbers?',
  //   closeHandler: () => { console.log('CLICK CANCEL'); },
  //   buttons: [
  //     {
  //       text: 'Ok',
  //       type: 'save',
  //       handler: () => { console.log('CLICK SAVE'); }
  //     },
  //     {
  //       text: 'Cancel',
  //       type: 'cancel',
  //       handler: () => { console.log('CLICK CANCEL'); }
  //     }
  //   ]
  // });
}
