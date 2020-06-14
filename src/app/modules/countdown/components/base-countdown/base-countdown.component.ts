import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, NgZone, OnDestroy, OnInit,
  PLATFORM_ID
} from '@angular/core';
import { timer } from 'rxjs/observable/timer';

import { RefreshService } from '../../../../services/refresh.service';

import { CountdownOptionsInterface } from '../../entities/interfaces/countdown-options.interface';
import { CountdownInterface } from '../../entities/interfaces/countdown.interface';
import { CountdownHelper } from '../../helpers/countdown.helper';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-base-countdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="showDays">
      {{days}} {{daysWord}}
    </ng-container>

    <ng-container *ngIf="showHours">
      {{hours}} {{hoursWord}}
    </ng-container>

    <ng-container *ngIf="showMinutes">
      {{minutes}} {{minutesWord}}
    </ng-container>

    <ng-container *ngIf="showSeconds">
      {{seconds}} {{secondsWord}}
    </ng-container>
  `,
})
export class BaseCountdownComponent implements OnInit, OnDestroy {
  @Input() date: string;
  @Input() options: CountdownOptionsInterface = {
    padDays: true,
    padHours: true,
    padMinutes: true,
    padSeconds: true,
  };

  showDays: boolean;
  days: number;
  daysWord: string;

  showHours: boolean;
  hours: number;
  hoursWord: string;

  showMinutes: boolean;
  minutes: number;
  minutesWord: string;

  showSeconds: boolean;
  seconds: number;
  secondsWord: string;

  showIcon: boolean;

  private aliveSubscriptions = true;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private refreshService: RefreshService,
              @Inject(PLATFORM_ID) protected platformId: Object,
              private zone: NgZone) {
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        timer(0, 1000)
          .takeWhile(() => this.aliveSubscriptions)
          .subscribe(() => {
            this.zone.run(() => {
              this.update();
            });
          });
      });
    }
  }

  ngOnDestroy(): void {
    this.aliveSubscriptions = false;
  }

  private update(): void {
    const countdown: CountdownInterface = CountdownHelper.countdown(this.date, this.options);
    this.showIcon = true;

    this.showDays = (countdown.days !== '0' && countdown.days !== '00');
    this.days = parseInt(countdown.days, 10);
    this.daysWord = countdown.daysWord;

    this.showHours = (countdown.hours !== '0' && countdown.hours !== '00');
    this.hours = parseInt(countdown.hours, 10);
    this.hoursWord = countdown.hoursWord;

    this.showMinutes = (countdown.minutes !== '0' && countdown.minutes !== '00');
    this.minutes = parseInt(countdown.minutes, 10);
    this.minutesWord = countdown.minutesWord;

    this.showSeconds = (countdown.seconds !== '0' && countdown.seconds !== '00');
    this.seconds = parseInt(countdown.seconds, 10);
    this.secondsWord = countdown.secondsWord;

    if (countdown.finished) {
      this.refreshService.emitRefreshEvent();
    }

    this.changeDetectorRef.markForCheck();
  }
}
