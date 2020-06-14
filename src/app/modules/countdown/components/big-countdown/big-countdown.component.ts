import { Component, ChangeDetectionStrategy, Input, ChangeDetectorRef, Inject, PLATFORM_ID, NgZone } from '@angular/core';

import { RefreshService } from '../../../../services/refresh.service';
import { BaseCountdownComponent } from '../base-countdown/base-countdown.component';
import { CountdownOptionsInterface } from '../../entities/interfaces/countdown-options.interface';

@Component({
  selector: 'app-big-countdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './big-countdown.component.html',
  styleUrls: ['./big-countdown.component.scss']
})
export class BigCountdownComponent extends BaseCountdownComponent {
  @Input() options: CountdownOptionsInterface = {
    padDays: false,
    padHours: false,
    padMinutes: false,
    padSeconds: false,
  };
  colonFormat = false;

  constructor(changeDetectorRef: ChangeDetectorRef,
              refreshService: RefreshService,
              @Inject(PLATFORM_ID) platformId: Object,
              zone: NgZone) {
    super(changeDetectorRef, refreshService, platformId, zone);
  }
}
