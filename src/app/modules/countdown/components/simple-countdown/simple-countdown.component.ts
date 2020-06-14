import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, NgZone, PLATFORM_ID } from '@angular/core';

import { RefreshService } from '../../../../services/refresh.service';
import { BaseCountdownComponent } from '../base-countdown/base-countdown.component';
import { CountdownOptionsInterface } from '../../entities/interfaces/countdown-options.interface';

@Component({
  selector: 'app-simple-countdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './simple-countdown.component.html',
  styleUrls: ['./simple-countdown.component.scss'],
})
export class SimpleCountdownComponent extends BaseCountdownComponent {
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
