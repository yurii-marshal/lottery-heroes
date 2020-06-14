import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Store } from '@ngrx/store';
import { timer } from 'rxjs/observable/timer';

import { SyndicateDto } from '@libs/biglotteryowin-api/dto/offerings/get-syndicates.dto';

import { BiglotteryowinCoreState } from '../../store/reducers';
import { SyndicatesLoadAction } from '../../store/actions/syndicates.actions';

@Injectable()
export class SyndicatesCommandService {
  constructor(private store: Store<BiglotteryowinCoreState>,
              private zone: NgZone,
              @Inject(PLATFORM_ID) private platformId: Object) {
  }

  scheduleRefresh(syndicates: SyndicateDto[]): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startRefreshTimers(syndicates);
    }
  }

  private startRefreshTimers(syndicates: SyndicateDto[]): void {
    let refreshNow = false;

    syndicates.forEach((syndicateDto: SyndicateDto) => {
      const nowTime = new Date().getTime();
      const refreshTime = new Date(syndicateDto.stop_sell_time).getTime();
      const timeToNext = refreshTime - nowTime;

      if (timeToNext > 0) {
        this.zone.runOutsideAngular(() => {
          timer(timeToNext).subscribe(() => {
            this.zone.run(() => {
              this.refreshActions();
            });
          });
        });
      } else {
        refreshNow = true;
      }
    });

    if (refreshNow) {
      this.zone.runOutsideAngular(() => {
        timer(10000).subscribe(() => {
          this.zone.run(() => {
            this.refreshActions();
          });
        });
      });
    }
  }

  private refreshActions(): void {
    this.store.dispatch(new SyndicatesLoadAction());
  }
}
