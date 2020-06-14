import {Component, OnInit, OnDestroy, NgZone, Input} from '@angular/core';
import {CustomerInterface} from '../../../../../services/auth/entities/interfaces/customer.interface';

@Component({
  selector: 'app-subscription-preferences',
  templateUrl: './subscription-preferences.component.html',
  styleUrls: ['./subscription-preferences.component.scss']
})
export class SubscriptionPreferencesComponent implements OnInit, OnDestroy {
  public isShownSubscriptions: boolean;
  public isShownModalSM = true;
  @Input() customer;
  customerObj: CustomerInterface;

  constructor() {
  }

  ngOnInit() {
    this.customer.subscribe(
      (data) => {
        if (data) {
          console.log(data);
          this.isShownSubscriptions = data['marketing_email_allowed'];
        }
      },
      (err) => console.error(err)
    );
  }

  ngOnDestroy() {
  }
}
