import { Component } from '@angular/core';

import { MetaService } from '../../../meta/services/meta.service';

@Component({
  selector: 'app-payment-pending',
  templateUrl: './payment-pending.component.html',
  styleUrls: ['./payment-pending.component.scss']
})
export class PaymentPendingComponent {
  constructor(metaService: MetaService) {
    metaService.setFromConfig('page', 'payment-pending');
  }
}
