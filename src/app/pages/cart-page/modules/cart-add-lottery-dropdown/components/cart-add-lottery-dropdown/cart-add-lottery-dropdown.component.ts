import { Component, EventEmitter, Inject, Input, NgZone, Output, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { WindowService } from '../../../../../../services/device/window.service';
import { AnalyticsDeprecatedService } from '../../../../../../modules/analytics-deprecated/services/analytics-deprecated.service';
import { CartAddLotteryDropdownModel } from '../../models/cart-add-lottery-dropdown.model';
import { CartNgSelectInterface } from '../../../cart/entities/cart-ng-select.interface';

@Component({
  selector: 'app-cart-add-lottery-dropdown',
  templateUrl: './cart-add-lottery-dropdown.component.html',
  styleUrls: ['./cart-add-lottery-dropdown.component.scss']
})
export class CartAddLotteryDropdownComponent {
  @Input() cartAddLotteryDropdownModel: CartAddLotteryDropdownModel;

  @Output() addToCartEvent = new EventEmitter();

  selectedOptionMobile: CartNgSelectInterface;
  scrollIntoView = require('scroll-into-view');

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              @Inject(DOCUMENT) private document,
              private windowService: WindowService,
              private analyticsDeprecatedService: AnalyticsDeprecatedService,
              private zone: NgZone) {
  }

  scrollToComponent(): void {
    const element = this.document.getElementById('proceed-to-checkout');
    const desktop = 100;
    const mobile = 150;
    let minusedValue = 0;

    if (this.windowService.nativeWindow.innerWidth < 768) {
      minusedValue = mobile;
    } else {
      minusedValue = desktop;
    }

    if (isPlatformBrowser(this.platformId) && element !== null) {
      if (element.getBoundingClientRect().top > this.windowService.nativeWindow.innerHeight - minusedValue) {
        this.zone.runOutsideAngular(() => {
          setTimeout(() => {
            this.zone.run(() => {
              this.scrollIntoView(element, {
                align: {
                  top: 0.96
                }
              });
            });
          }, 500);
        });
      }
    }
  }

  onTrackAddLotteryToCart() {
    this.analyticsDeprecatedService.trackAddLotteryToCart();
  }

}
