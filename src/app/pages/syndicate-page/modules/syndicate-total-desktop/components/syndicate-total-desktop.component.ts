import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Inject,
  Input, OnChanges, Output, PLATFORM_ID, Renderer2, SimpleChanges, ViewChild
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { ScrollService } from '../../../../../services/device/scroll.service';

import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';

@Component({
  selector: 'app-syndicate-total-desktop',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './syndicate-total-desktop.component.html',
  styleUrls: ['./syndicate-total-desktop.component.scss']
})
export class SyndicateTotalDesktopComponent implements AfterViewInit, OnChanges {
  @Input() syndicateModel: SyndicateModel;
  @Input() sharesAmount: number;

  @Output() addToCartEvent = new EventEmitter<{templateId: number, lotteryId: string; sharesAmount: number}>();

  @ViewChild('asideContainer') asideContainer: ElementRef;
  @ViewChild('asideBody') asideBody: ElementRef;

  private aliveSubscriptions = true;
  totalSyndicatePrice: number;

  constructor(private scrollService: ScrollService,
              private el: ElementRef,
              private renderer: Renderer2,
              @Inject(PLATFORM_ID) private platformId: Object) {

  }

  ngAfterViewInit(): void {
    this.initSticky();
  }

  private initSticky() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const con = this.asideContainer.nativeElement;
    const bod = this.asideBody.nativeElement;

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sharesAmount']) {
      this.totalSyndicatePrice = this.sharesAmount ? this.syndicateModel.sharePrice * this.sharesAmount : 0;
    }
  }
}
