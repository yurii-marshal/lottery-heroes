import { Component, AfterViewInit, OnDestroy, ElementRef, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ScrollService } from '../../../../services/device/scroll.service';
import { BrandParamsService } from '../../../brand/services/brand-params.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-need-help',
  templateUrl: './need-help.component.html',
  styleUrls: ['./need-help.component.scss']
})
export class NeedHelpComponent implements OnInit, AfterViewInit, OnDestroy {
  // BrandParams
  isShowChat: boolean;
  supportEmail: string;

  private scrollSubscription: Subscription;

  constructor(private scrollService: ScrollService,
              private el: ElementRef,
              private renderer: Renderer2,
              @Inject(PLATFORM_ID) private platformId: Object,
              private brandParamsService: BrandParamsService) {
  }

  ngOnInit() {
    this.brandParamsService.getConfig('supportEmail')
      .subscribe(configValue => this.supportEmail = configValue);

    this.brandParamsService.getConfig('isShowChat').subscribe(configValue => this.isShowChat = configValue);
  }

  ngAfterViewInit() {
    this.initScroll();
  }

  private initScroll() {
    if (isPlatformBrowser(this.platformId)) {
      const con = this.el.nativeElement.querySelector('.aside-container');
      const bod = this.el.nativeElement.querySelector('.aside');

      this.scrollSubscription = this.scrollService.getYOffset()
        .subscribe(YOffset => {
          const conHeight = con.offsetHeight;
          const bodHeight = bod.offsetHeight;
          const topCon = con.getBoundingClientRect().top;
          const conTop = con.getBoundingClientRect().top + YOffset - 100;
          const redLine = -(conHeight - bodHeight - conTop);

          if (bodHeight === conHeight) {
            return;
          } else if (topCon < conTop && topCon > redLine) {
            this.renderer.removeClass(bod, 'bottom');
            this.renderer.addClass(bod, 'fixed');
          } else if (topCon < redLine) {
            this.renderer.removeClass(bod, 'fixed');
            this.renderer.addClass(bod, 'bottom');
          } else {
            this.renderer.removeClass(bod, 'bottom');
            this.renderer.removeClass(bod, 'fixed');
          }
        });
    }
  }

  ngOnDestroy() {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }
}
