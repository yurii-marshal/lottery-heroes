import {
  Component, ChangeDetectionStrategy, Input, EventEmitter, Output, ElementRef, Renderer2, AfterViewInit, ChangeDetectorRef, PLATFORM_ID,
  Inject, NgZone
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { TicketDesktopComponent } from '../ticket-desktop/ticket-desktop.component';
import { LotteryInterface } from '../../../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import {
  OfferDisplayPropertiesInterface,
  OfferFreeLinesInterface
} from '../../../../../../modules/api/entities/incoming/offerings/offerings-offers.interface';
import { fromEvent } from 'rxjs/observable/fromEvent';

@Component({
  selector: 'app-ticket-free-desktop',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ticket-free-desktop.component.html',
  styleUrls: ['./ticket-free-desktop.component.scss'],
})
export class TicketFreeDesktopComponent extends TicketDesktopComponent implements AfterViewInit {
  @Input() isOpenedFreeLine: boolean;
  @Input() freeLinesOfferDisplayProperties: OfferDisplayPropertiesInterface;
  @Input() freeLinesOffer: OfferFreeLinesInterface;
  @Input() lottery: LotteryInterface;

  @Output() autoselectForFreeLineIdEvent = new EventEmitter<string>();
  @Output() addToCartFromRibbonEvent = new EventEmitter<any>();

  constructor(renderer: Renderer2,
              elementRef: ElementRef,
              changeDetectorRef: ChangeDetectorRef,
              @Inject(PLATFORM_ID) private platformId: Object,
              zone: NgZone) {
    super(renderer, elementRef, changeDetectorRef, zone);
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    if (isPlatformBrowser(this.platformId)) {
      fromEvent(this.elementRef.nativeElement.querySelector('.free-line'), 'transitionend')
        .filter((event: TransitionEvent) => (event.target as Element).classList.contains('free-line'))
        .takeWhile(() => this.aliveSubscriptions)
        .subscribe(() => {
          if (this.isOpenedFreeLine && !this.isFilledLine) {
            this.autoselectLineEvent.emit({line: this.line, rules: this.rules, track: false});
          }
        });
    }
  }

  addToCartFromRibbon(event, data) {
    event.preventDefault();
    this.addToCartFromRibbonEvent.emit(data);
  }

}
