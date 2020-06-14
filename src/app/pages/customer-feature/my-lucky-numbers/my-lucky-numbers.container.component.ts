import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';

import { MyLuckyNumbersSandbox } from './my-lucky-numbers.sandbox';
import { Observable } from 'rxjs/Observable';
import { DeviceType } from '../../../services/device/entities/types/device.type';
import { LuckyNumbersItemInterface } from '../../../services/api/entities/incoming/lotteries/lucky-numbers.interface';

@Component({
  selector: 'app-my-lucky-numbers-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-my-lucky-numbers
      [device]="device$|async"
      [editLuckyNumbers$]="editLuckyNumbers$"
      [editNewLuckyNumbers$]="editNewLuckyNumbers$"
      (backToMenu)="onBackToMenu()"
    ></app-my-lucky-numbers>
  `,
})
export class MyLuckyNumbersContainerComponent implements OnInit, OnDestroy {
  device$: Observable<DeviceType>;
  editLuckyNumbers$: Observable<LuckyNumbersItemInterface[]>;
  editNewLuckyNumbers$: Observable<LuckyNumbersItemInterface[]>;

  constructor(private sandbox: MyLuckyNumbersSandbox) {}

  ngOnInit() {
    this.device$ = this.sandbox.getDevice$();
    this.editLuckyNumbers$ = this.sandbox.getEditLuckyNumbers();
    this.editNewLuckyNumbers$ = this.sandbox.getEditNewLuckyNumbers();
  }

  // Events
  onBackToMenu() {
    this.sandbox.onBackToMenu();
  }

  ngOnDestroy() {
    this.sandbox.clearStoredGroups();
  }

}
