import {
  Component, ElementRef, EventEmitter, HostListener, Inject, OnDestroy, OnInit, Output, PLATFORM_ID,
  Renderer2
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ScrollService } from '../../../../services/device/scroll.service';
import { DeviceService } from '../../../../services/device/device.service';
import { GlobalService } from '../../../../services/global.service';
import { AnalyticsDeprecatedService } from '../../../analytics-deprecated/services/analytics-deprecated.service';

import { DeviceType } from '../../../../services/device/entities/types/device.type';
import { isPlatformBrowser } from '@angular/common';
import { BrandParamsService } from '../../../brand/services/brand-params.service';
import { CustomerService } from '../../../../services/auth/customer.service';

@Component({
  selector: 'app-about-menu',
  templateUrl: './about-menu.component.html',
  styleUrls: ['./about-menu.component.scss']
})
export class AboutMenuComponent implements OnInit, OnDestroy {
  @Output() aboutClickEvent = new EventEmitter();
  device$: Observable<DeviceType>;
  isLogged$: Observable<boolean>;
  showMenuItem: { [key: string]: boolean };
  private aliveSubscriptions = true;
  private asideElementWrapper: HTMLElement;
  private asideElementBody: HTMLElement;

  @HostListener('window:resize')
  onWindowResize() {
    this.setElementWidth();
  }

  constructor(private renderer: Renderer2,
              @Inject(PLATFORM_ID) private platformId: Object,
              private el: ElementRef,
              private scrollService: ScrollService,
              private deviceService: DeviceService,
              public globalService: GlobalService,
              private analyticsDeprecatedService: AnalyticsDeprecatedService,
              private brandParamsService: BrandParamsService,
              private customerService: CustomerService) {
    this.device$ = this.deviceService.getDevice();
    this.isLogged$ = this.customerService.getCustomer().map(customer => customer !== null);
  }

  ngOnInit(): void {

    this.brandParamsService.getConfig('aboutPageMenu', 'showMenuItem')
      .subscribe(configValue => this.showMenuItem = configValue);

    this.asideElementWrapper = this.el.nativeElement.querySelector('.about-menu-wrapper');
    this.asideElementBody = this.el.nativeElement.querySelector('.about-menu');

    this.initScroll();
  }

  private initScroll() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.scrollService.getYOffset()
      .takeWhile(() => this.aliveSubscriptions)
      .subscribe(YOffset => {

        const asideElementWrapperHeight = this.asideElementWrapper.offsetHeight;
        const asideElementBodyHeight = this.asideElementBody.offsetHeight;

        // element coordinates relative to the window
        const coordsRelativeWindow = this.asideElementWrapper.getBoundingClientRect().top;
        // element coordinates relative to the document (without - 128)
        const coordsRelativeDocument = this.asideElementWrapper.getBoundingClientRect().top + YOffset - 80;
        const triggerCoordsPoint = -(asideElementWrapperHeight - asideElementBodyHeight - coordsRelativeDocument);

        this.setElementWidth();

        if (asideElementBodyHeight === asideElementWrapperHeight) {
          return;
        } else if (coordsRelativeWindow < coordsRelativeDocument && coordsRelativeWindow > triggerCoordsPoint) {
          this.renderer.removeClass(this.asideElementBody, 'bottom');
          this.renderer.addClass(this.asideElementBody, 'fixed');
        } else if (coordsRelativeWindow < triggerCoordsPoint) {
          this.renderer.removeClass(this.asideElementBody, 'fixed');
          this.renderer.addClass(this.asideElementBody, 'bottom');
        } else {
          this.renderer.removeClass(this.asideElementBody, 'bottom');
          this.renderer.removeClass(this.asideElementBody, 'fixed');
        }
      });
  }

  private setElementWidth(): void {
    this.asideElementBody.style.width = this.asideElementWrapper.offsetWidth + 'px';
  }

  onWinBtnClicked(): void {
    this.globalService.showLightbox$.emit({name: 'auth', value: 'signup'});
    this.onTrackWinButtonClicked();
  }

  onTrackWinButtonClicked(): void {
    this.analyticsDeprecatedService.trackFooterWinButtonClicked();
  }

  ngOnDestroy(): void {
    this.aliveSubscriptions = false;
  }
}
