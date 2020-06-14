import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CombosService } from '../../../../services/combos/combos.service';
import { DeviceService } from '../../../../services/device/device.service';
import { DeviceType } from '../../../../services/device/entities/types/device.type';
import { ComboItemModel } from '../../../../models/combo.model';

@Component({
  selector: 'app-combos-menu-list-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-combos-menu-list
      *ngIf="(device$|async) === 'desktop'"
      [combosList]="combosList$|async"
    ></app-combos-menu-list>
    <app-combos-menu-list-mobile
      *ngIf="(device$|async) === 'mobile'"
      [combosList]="combosList$|async"
    ></app-combos-menu-list-mobile>
  `
})
export class CombosMenuListContainerComponent implements OnInit {
  combosList$: Observable<ComboItemModel[]>;
  device$: Observable<DeviceType>;

  constructor(private deviceService: DeviceService,
              private combosService: CombosService) {
  }

  ngOnInit(): void {
    this.device$ = this.deviceService.getDevice();
    this.combosList$ = this.device$.switchMap(device => {
      if (device === 'desktop') {
        return this.combosService.getSortedByPriorityDisplayedCombosList('combos').map(ids => ids.slice(0, 8));
      } else {
        return this.combosService.getSortedByPriorityDisplayedCombosList('combos').map(ids => ids.slice(0, 3));
      }
    });
  }
}
