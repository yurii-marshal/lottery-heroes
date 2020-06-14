import {
  Component, ChangeDetectionStrategy, Input, ChangeDetectorRef, OnInit, Renderer2, Inject, PLATFORM_ID,
  NgZone
} from '@angular/core';

import { RefreshService } from '../../../../services/refresh.service';
import { BaseCountdownComponent } from '../base-countdown/base-countdown.component';
import { CountdownOptionsInterface } from '../../entities/interfaces/countdown-options.interface';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-flipped-countdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="time-left flipped-countdown-component"></div>`
})
export class FlippedCountdownComponent extends BaseCountdownComponent implements OnInit {
  @Input() options: CountdownOptionsInterface = {
    padDays: true,
    padHours: true,
    padMinutes: true,
    padSeconds: true,
  };

  constructor(changeDetectorRef: ChangeDetectorRef,
              refreshService: RefreshService,
              @Inject(DOCUMENT) private document,
              @Inject(PLATFORM_ID) platformId: Object,
              private renderer: Renderer2,
              zone: NgZone) {
    super(changeDetectorRef, refreshService, platformId, zone);
  }

  ngOnInit() {
    this.initCountDown();
  }

  // https://github.com/Dazix/SimpleCountDown
  initCountDown() {
    if (isPlatformBrowser(this.platformId)) {
      const s = this.renderer.createElement('script');
      s.type = `text/javascript`;
      s.src = 'assets/flipped-countdown.js';
      s.onload = () => {
        this.createCountDown();
      };

      if (typeof(Countdown) === 'undefined') {
        this.renderer.appendChild(this.document.body, s);
      } else {
        this.createCountDown();
      }
    }
  }

  createCountDown() {
    const timer = new Countdown({
      cont: this.renderer.selectRootElement('.flipped-countdown-component'),
      outputFormat: 'hour|minute|second',
      endDate: this.date,
      outputTranslation: {
        hour: 'Hours',
        minute: 'Minutes',
        second: 'Seconds'
      }
    });

    timer.start();
  }
}
