import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { MetaService } from '../../../modules/meta/services/meta.service';
import { DeviceService } from '../../../services/device/device.service';
import { DeviceType } from '../../../services/device/entities/types/device.type';

@Component({
  selector: 'app-about-us',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  device$: Observable<DeviceType>;

  constructor(private metaService: MetaService,
              private deviceService: DeviceService) {
  }

  ngOnInit(): void {
    this.device$ = this.deviceService.getDevice();
    this.metaService.setFromConfig('page', 'about');
  }

}
