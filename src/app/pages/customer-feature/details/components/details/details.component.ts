import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CustomerService } from '../../../../../services/auth/customer.service';
import { DeviceService } from '../../../../../services/device/device.service';
import { Subscription } from 'rxjs/Subscription';
import { AccountService } from '../../../../../services/account/account.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnDestroy {
  customer$: Observable<any>;
  deviceSubscription: Subscription;
  device: string;

  constructor(private customerService: CustomerService,
              private deviceService: DeviceService,
              private accountService: AccountService) {
    this.customer$ = this.customerService.getCustomer();
    this.deviceSubscription = deviceService.getDevice().subscribe(device => this.onChangeDevice(device));
  }

  onChangeDevice(device) {
    this.device = device;
  }

  onBackToMenu() {
    this.accountService.emitClick('from-back');
  }

  ngOnDestroy() {
    this.deviceSubscription.unsubscribe();
  }

}
