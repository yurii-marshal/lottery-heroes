import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { MetaService } from '../../../../modules/meta/services/meta.service';
import { DeviceService } from '../../../../services/device/device.service';
import { DeviceType } from '../../../../services/device/entities/types/device.type';

@Component({
  selector: 'app-about-us-uk',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-us-uk.component.html',
  styleUrls: ['./about-us-uk.component.scss']
})
export class AboutUsUkComponent implements OnInit {
  device$: Observable<DeviceType>;

  constructor(private metaService: MetaService,
              private deviceService: DeviceService) {
  }

  ngOnInit(): void {
    this.device$ = this.deviceService.getDevice();
    this.metaService.setFromConfig('page', 'about');
  }

}
