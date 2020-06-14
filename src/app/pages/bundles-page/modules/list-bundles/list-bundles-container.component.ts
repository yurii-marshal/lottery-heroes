import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { DeviceType } from '../../../../services/device/entities/types/device.type';
import { DeviceService } from '../../../../services/device/device.service';
import * as listBundlesActions from './actions/list-bundles.actions';
import * as fromRoot from '../../../../store/reducers/index';
import { Store } from '@ngrx/store';
import { LineInterface } from '../../../../modules/api/entities/outgoing/common/line.interface';
import { SyndicatesQueryService } from '@libs/biglotteryowin-core/services/queries/syndicates-query.service';
import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';
import {CartBundleItemModel} from '../../../../models/cart/cart-bundle-item.model';
import {BundleItemModel} from '../../../../models/bundle.model';
import {Cart2BundleService} from '../../../../services/cart2/cart2-bundle.service';

@Component({
  selector: 'app-list-bundles-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-list-bundles
      *ngIf="bundlesList !== null"
      [bundlesList]="bundlesList"
      [device]="device$|async"
      (addToCart)="addToCart($event)"
    ></app-list-bundles>`
})
export class ListBundlesContainerComponent implements OnInit {
  @Input() bundlesList: Array<BundleItemModel>;

  device$: Observable<DeviceType>;

  constructor(private cart2BundleService: Cart2BundleService,
              private router: Router,
              private deviceService: DeviceService,
              private store: Store<fromRoot.State>,
              private syndicatesQueryService: SyndicatesQueryService) {
  }

  ngOnInit() {
    this.device$ = this.deviceService.getDevice();
  }

  addToCart(bundle) {
    const addItems = [];
    const lines = this.cart2BundleService.generateLines(bundle);
    const shares = this.cart2BundleService.generateShares(bundle);
    const item = new CartBundleItemModel(bundle.id, lines, shares);
    addItems.push(item);

    this.cart2BundleService.addItems(addItems);
    this.store.dispatch(new listBundlesActions.AddToCart({ bundle, url: this.router.url }));
    this.router.navigate(['/cart']);
  }
}
