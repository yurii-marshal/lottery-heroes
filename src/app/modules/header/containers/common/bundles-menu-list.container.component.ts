import {Component, ChangeDetectionStrategy, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {DeviceService} from '../../../../services/device/device.service';
import {DeviceType} from '../../../../services/device/entities/types/device.type';
import {BundlesService} from '../../../../services/bundles/bundles.service';
import {BundleItemModel} from '../../../../models/bundle.model';

@Component({
  selector: 'app-bundles-menu-list-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-bundles-menu-list
      *ngIf="(device$|async) === 'desktop'"
      [bundlesList]="bundlesList$|async"
    ></app-bundles-menu-list>
    <app-bundles-menu-list-mobile
      *ngIf="(device$|async) === 'mobile'"
      [bundlesList]="bundlesList$|async"
    ></app-bundles-menu-list-mobile>
  `
})
export class BundlesMenuListContainerComponent implements OnInit {
  bundlesList$: Observable<BundleItemModel[]>;
  device$: Observable<DeviceType>;

  constructor(private deviceService: DeviceService,
              private bundlesService: BundlesService) {
  }

  ngOnInit(): void {
    this.device$ = this.deviceService.getDevice();
    this.bundlesList$ = this.device$.switchMap(device => {
      if (device === 'desktop') {
        return this.bundlesService.getSortedByPriorityDisplayedBundlesList('bundles').map(ids => ids.slice(0, 8));
      } else {
        return this.bundlesService.getSortedByPriorityDisplayedBundlesList('bundles').map(ids => ids.slice(0, 3));
      }
    });
  }
}
