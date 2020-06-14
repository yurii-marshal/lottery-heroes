import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ScrollService } from '../../../../services/device/scroll.service';

import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-results-aside',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './results-aside.component.html',
  styleUrls: ['./results-aside.component.scss']
})
export class ResultsAsideComponent implements AfterViewInit, OnDestroy {

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(@Inject(DOCUMENT) private document,
              @Inject(PLATFORM_ID) private platformId: Object,
              private scrollService: ScrollService) {
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.scrollService.getScrollEvent()
        .pipe(
          takeUntil(this.unsubscribe$),
        )
        .subscribe(() => {
          const con = this.document.querySelector('.widgets-aside-container'),
            bod = this.document.querySelector('.widget-body'),
            conHeight = (<HTMLElement>this.document.querySelector('.widgets-aside-container')).offsetHeight,
            bodHeight = (<HTMLElement>this.document.querySelector('.widget-body')).offsetHeight,
            topCon = getCoords(con),
            conTop = getCoordsAtWindow(con) / 2,
            redLine = -(conHeight - bodHeight - conTop);

          function getCoordsAtWindow(e) {
            const box = e.getBoundingClientRect();
            return box.top + pageYOffset;
          }

          function getCoords(e) {
            const box = e.getBoundingClientRect();
            return box.top;
          }

          if (topCon < conTop && topCon > redLine) {
            bod.classList.remove('bottom');
            bod.classList.add('fixed');
          } else if (topCon < redLine) {
            bod.classList.remove('fixed');
            bod.classList.add('bottom');
          } else {
            bod.classList.remove('fixed');
          }
        });
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
