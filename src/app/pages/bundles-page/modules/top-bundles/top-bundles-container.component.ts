import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';
import {DeviceType} from '../../../../services/device/entities/types/device.type';
import {DeviceService} from '../../../../services/device/device.service';
import {LineInterface} from '../../../../modules/api/entities/outgoing/common/line.interface';
import {Cart2BundleService} from '../../../../services/cart2/cart2-bundle.service';
import {BundleItemModel} from '../../../../models/bundle.model';
import {CartBundleItemModel} from '../../../../models/cart/cart-bundle-item.model';

@Component({
  selector: 'app-top-bundles-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-top-bundles
      *ngIf="bundlesList !== null"
      [bundlesList]="bundlesList"
      [device]="device$|async"
      (addToCart)="addToCart($event)"
    ></app-top-bundles>`
})
export class TopBundlesContainerComponent implements OnInit {
  @Input() bundlesList: Array<BundleItemModel>;

  device$: Observable<DeviceType>;

  constructor(private cart2BundleService: Cart2BundleService,
              private router: Router,
              private deviceService: DeviceService) {
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
    this.router.navigate(['/cart']);
  }
}
