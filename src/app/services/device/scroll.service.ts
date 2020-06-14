import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { WindowService } from './window.service';
import { isPlatformBrowser } from '@angular/common';
import { fromEvent } from 'rxjs/observable/fromEvent';

@Injectable()
export class ScrollService {
  private scrollEventSubject$: Subject<Event>;
  private scrollEventDirection$: Subject<string>;
  private yOffsetSubject$: BehaviorSubject<number>;
  private windowYOffsetPosition = 0;

  scrollIntoView = require('scroll-into-view');

  constructor(private windowService: WindowService,
              @Inject(PLATFORM_ID) private platformId: Object,
              private zone: NgZone) {
    this.scrollEventSubject$ = new Subject();
    this.scrollEventDirection$ = new Subject();
    this.yOffsetSubject$ = new BehaviorSubject(0);

    if (isPlatformBrowser(this.platformId)) {
      fromEvent(this.windowService.nativeWindow, 'scroll').subscribe(this.scrollEventSubject$);
      this.scrollEventSubject$.subscribe((scrollEvent: Event) => {
        const pageYOffset = this.windowService.nativeWindow.pageYOffset;
        const direction = (this.windowYOffsetPosition > pageYOffset) ? 'up' : 'down';
        this.scrollEventDirection$.next(direction);
        this.yOffsetSubject$.next(pageYOffset);
        this.windowYOffsetPosition = pageYOffset;
      });
    }
  }

  getScrollEvent(): Observable<Event> {
    return this.scrollEventSubject$.asObservable();
  }

  getScrollDirection(): Observable<string> {
    return this.scrollEventDirection$.asObservable();
  }

  getYOffset(): Observable<number> {
    return this.yOffsetSubject$.asObservable();
  }

  toTop(duration = 600) {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.zone.run(() => {
          this.windowService.nativeWindow.scroll(0, 0);
        });
      }, 0);
    });
  }

  scrollTo(nativeElement: HTMLElement) {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.zone.run(() => {
          /* allows you scroll to the selected nativeElement and stop when its appear in the middle/center of any size screen */
          const windowYScroll = this.windowService.nativeWindow.pageYOffset,
            userScreen = this.windowService.nativeWindow.innerHeight,
            elementOffsetTop = nativeElement.getBoundingClientRect().top + windowYScroll,
            elementHeight = nativeElement.offsetHeight,
            scrollToElement = elementOffsetTop - (userScreen - elementHeight) / 2;

          this.windowService.nativeWindow.scroll(0, scrollToElement);
        });
      }, 0);
    });
  }

  scrollToSmooth(nativeElement: HTMLElement) {
    /* allows you scroll page to selected nativeElement with smooth effect */
    this.scrollIntoView(nativeElement, {
      align: {
        top: 0.5
      }
    });
  }

  scrollToErrorInForm(nativeElement) {
    /* allows you scroll element (lightbox) to selected nativeElement with smooth effect */
    /* https://www.npmjs.com/package/scroll-into-view */
    let topPosition = 0.1;
    if (nativeElement.parentNode.classList[0] === 'lightbox-modal') {
      topPosition = 0.03;
    }

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.zone.run(() => {
          if (nativeElement.querySelector('.has-error')) {
            this.scrollIntoView(nativeElement.querySelector('.has-error'), {
              align: {
                top: topPosition
              }
            });
          }
        });
      }, 100);
    });
  }

}
