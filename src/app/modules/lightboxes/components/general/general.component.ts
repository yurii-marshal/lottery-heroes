import { Component, Inject, OnDestroy } from '@angular/core';
import { LightboxesService } from '../../services/lightboxes.service';
import { LightboxDataButtonInterface, LightboxDataInterface } from '../../interfaces/lightbox-data.interface';
import { Subscription } from 'rxjs/Subscription';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnDestroy {
  lightboxName = 'general';
  isShowlightbox = false;
  isShowButtons = false;
  data: LightboxDataInterface;
  closeSubscription: Subscription;

  constructor(protected lightboxesService: LightboxesService,
              @Inject(DOCUMENT) protected document) {
    lightboxesService.getShowEventEmitter()
      .filter((data: LightboxDataInterface) => data.type === this.lightboxName)
      .subscribe((data: LightboxDataInterface) => this.showLightbox(data));
    this.closeSubscription = lightboxesService.getCloseAllEventEmitter().subscribe(() => this.closeLightbox());
  }

  getBtnByType(type: string): LightboxDataButtonInterface {
    return this.data && this.data.buttons ? this.data.buttons.find(btn => btn.type === type) : undefined;
  }

  showLightbox(data: LightboxDataInterface) {
    this.isShowButtons = (('buttons' in data) && data.buttons.length > 0);
    this.data = data;
    this.document.body.classList.add('fixed');
    this.isShowlightbox = true;
  }

  closeLightbox() {
    this.document.body.classList.remove('fixed');
    this.isShowlightbox = false;
    if (this.data && ('closeHandler' in this.data)) {
      this.data.closeHandler();
    }
  }

  clickBtn(btnInfo: LightboxDataButtonInterface) {
    this.document.body.classList.remove('fixed');
    this.isShowlightbox = false;
    if ('handler' in btnInfo) {
      btnInfo.handler();
    }
  }

  ngOnDestroy() {
    this.closeSubscription.unsubscribe();
  }
}
