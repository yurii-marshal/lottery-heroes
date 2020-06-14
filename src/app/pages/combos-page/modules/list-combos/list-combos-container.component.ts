import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CartComboItemModel } from '../../../../models/cart/cart-combo-item.model';
import { Cart2ComboService } from '../../../../services/cart2/cart2-combo.service';
import { ComboItemModel } from '../../../../models/combo.model';
import { DeviceType } from '../../../../services/device/entities/types/device.type';
import { DeviceService } from '../../../../services/device/device.service';
import * as listCombosActions from './actions/list-combos.actions';
import * as fromRoot from '../../../../store/reducers/index';
import { Store } from '@ngrx/store';
import { LineInterface } from '../../../../modules/api/entities/outgoing/common/line.interface';
import { SyndicatesQueryService } from '@libs/biglotteryowin-core/services/queries/syndicates-query.service';
import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';

@Component({
  selector: 'app-list-combos-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-list-combos
      *ngIf="combosList !== null"
      [combosList]="combosList"
      [device]="device$|async"
      (addToCart)="addToCart($event)"
    ></app-list-combos>`
})
export class ListCombosContainerComponent implements OnInit {
  @Input() combosList: Array<ComboItemModel>;

  device$: Observable<DeviceType>;

  constructor(private cart2ComboService: Cart2ComboService,
              private router: Router,
              private deviceService: DeviceService,
              private store: Store<fromRoot.State>,
              private syndicatesQueryService: SyndicatesQueryService) {
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
    this.store.dispatch(new listCombosActions.AddToCart({ combo, url: this.router.url }));
    this.router.navigate(['/cart']);
  }
}
