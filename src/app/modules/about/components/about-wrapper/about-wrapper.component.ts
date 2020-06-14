import { Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { DeviceService } from '../../../../services/device/device.service';
import { DeviceType } from '../../../../services/device/entities/types/device.type';

import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-wrapper',
  templateUrl: './about-wrapper.component.html',
  styleUrls: ['./about-wrapper.component.scss']
})
export class AboutWrapperComponent implements OnInit, OnDestroy {
  @Input() headline: string;
  @Input() isVisibleContent = true;
  device$: Observable<DeviceType>;
  device: string;
  aliveSubscriptions = true;

  constructor(private deviceService: DeviceService,
              private router: Router,
              @Inject(PLATFORM_ID) private platformId: Object) {

    this.device$ = this.deviceService.getDevice();
  }

  ngOnInit(): void {
    this.deviceService.getDevice()
      .takeWhile(() => this.aliveSubscriptions)
      .subscribe(device => {
        this.device = device;
        if (this.device === 'desktop') {
          this.aboutUsRedirect();
        }
      });
  }

  showContent(): void {
    this.isVisibleContent = true;
  }

  hideContent(): void {
    this.isVisibleContent = false;
  }

  aboutUsRedirect() {
    if (this.router.url === '/about') {
      this.router.navigate(['/about/about-us']);
    }
  }

  ngOnDestroy() {
    this.aliveSubscriptions = false;
  }
}
