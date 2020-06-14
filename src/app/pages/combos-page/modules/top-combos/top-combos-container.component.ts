import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { CartComboItemModel } from '../../../../models/cart/cart-combo-item.model';
import { Cart2ComboService } from '../../../../services/cart2/cart2-combo.service';
import { ComboItemModel } from '../../../../models/combo.model';
import { DeviceType } from '../../../../services/device/entities/types/device.type';
import { DeviceService } from '../../../../services/device/device.service';
import { LineInterface } from '../../../../modules/api/entities/outgoing/common/line.interface';

@Component({
  selector: 'app-top-combos-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-top-combos
      *ngIf="combosList !== null"
      [combosList]="combosList"
      [device]="device$|async"
      (addToCart)="addToCart($event)"
    ></app-top-combos>`
})
export class TopCombosContainerComponent implements OnInit {
  @Input() combosList: Array<ComboItemModel>;

  device$: Observable<DeviceType>;

  constructor(private cart2ComboService: Cart2ComboService,
              private router: Router,
              private deviceService: DeviceService) {
  }

  ngOnInit() {
    this.device$ = this.deviceService.getDevice();
  }

  addToCart(combo) {
    const addItems = [];
    const lines = this.cart2ComboService.generateLines(combo);
    const shares = this.cart2ComboService.generateShares(combo);
    const item = new CartComboItemModel(combo.id, lines, shares);
    addItems.push(item);

    this.cart2ComboService.addItems(addItems);
    this.router.navigate(['/cart']);
  }
}
