import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { WindowService } from './window.service';
import { DeviceType } from './entities/types/device.type';
import { isPlatformBrowser } from '@angular/common';
import { fromEvent } from 'rxjs/observable/fromEvent';

@Injectable()
export class DeviceService {
  private deviceSubject$: BehaviorSubject<DeviceType>;
  private device$: Observable<DeviceType>;

  constructor(private windowService: WindowService, @Inject(PLATFORM_ID) private platformId: Object) {
    this.deviceSubject$ = new BehaviorSubject(<DeviceType>'desktop');
    this.device$ = this.deviceSubject$.asObservable();

    if (isPlatformBrowser(this.platformId)) {
      fromEvent(this.windowService.nativeWindow, 'resize')
        .map((event: Event) => (<Window>event.target).innerWidth)
        .startWith(window.innerWidth)
        .map((width: number) => width < 768 ? <DeviceType>'mobile' : <DeviceType>'desktop')
        .distinctUntilChanged()
        .subscribe((device: DeviceType) => this.deviceSubject$.next(device));
    }
  }

  getDevice(): Observable<DeviceType> {
    return this.device$;
  }
}
