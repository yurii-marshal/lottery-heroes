import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Store } from '@ngrx/store';
import { timer } from 'rxjs/observable/timer';

import { DrawDto } from '@libs/biglotteryowin-api/dto/lotteries/draw.dto';

import { BiglotteryowinCoreState } from '../../store/reducers';
import { LatestDrawsLoadAction, UpcomingDrawsLoadAction } from '../../store/actions/draws.actions';

@Injectable()
export class DrawsCommandService {
  constructor(private store: Store<BiglotteryowinCoreState>,
              private zone: NgZone,
              @Inject(PLATFORM_ID) private platformId: Object) {
  }

  scheduleRefresh(draws: DrawDto[]): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startRefreshTimers(draws);
    }
  }

  private startRefreshTimers(draws: DrawDto[]): void {
    let refreshNow = false;

    draws.forEach((drawDto: DrawDto) => {
      const nowTime = new Date().getTime();
      const refreshTime = new Date(drawDto.last_ticket_time).getTime();
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
    this.store.dispatch(new UpcomingDrawsLoadAction());
    this.store.dispatch(new LatestDrawsLoadAction());
  }
}
