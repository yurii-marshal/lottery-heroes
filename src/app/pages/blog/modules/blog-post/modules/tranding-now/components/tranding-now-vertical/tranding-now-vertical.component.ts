import { Component, ElementRef, Inject, Input, OnDestroy, OnInit, PLATFORM_ID, Renderer2, ViewEncapsulation } from '@angular/core';
import { BrandParamsService } from '../../../../../../../../modules/brand/services/brand-params.service';
import { EnvironmentService } from '../../../../../../../../services/environment/environment.service';
import { isPlatformBrowser } from '@angular/common';
import { ScrollService } from '../../../../../../../../services/device/scroll.service';

@Component({
  selector: 'app-tranding-now-vertical',
  templateUrl: './tranding-now-vertical.component.html',
  styleUrls: ['./tranding-now-vertical.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TrandingNowVerticalComponent implements OnInit, OnDestroy {

  @Input() trandingNow: {
    slug: string;
    title: string;
    date: Date;
    image: string;
    shortContent: string;
  }[];
  @Input() host: string;

  private aliveSubscriptions = true;

  constructor(private brandParamsService: BrandParamsService,
              private environmentService: EnvironmentService,
              private scrollService: ScrollService,
              private el: ElementRef,
              private renderer: Renderer2,
              @Inject(PLATFORM_ID) private platformId: Object) {
  }

  ngOnInit() {
    this.initScroll();
  }

  private initScroll() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const con = this.el.nativeElement.querySelector('.aside-container');
    const bod = this.el.nativeElement.querySelector('.aside-body');

    this.scrollService.getYOffset()
      .takeWhile(() => this.aliveSubscriptions)
      .subscribe(YOffset => {

        const conHeight = con.offsetHeight;
        const bodHeight = bod.offsetHeight;
        const topCon = con.getBoundingClientRect().top; // element coordinates relative to the window
        const conTop = con.getBoundingClientRect().top + YOffset - 100; // element coordinates relative to the document (without - 128)
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

  ngOnDestroy() {
    this.aliveSubscriptions = false;
  }
}
