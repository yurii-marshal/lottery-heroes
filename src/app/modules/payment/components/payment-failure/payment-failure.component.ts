import { Component } from '@angular/core';

import { MetaService } from '../../../meta/services/meta.service';

@Component({
  selector: 'app-payment-failure',
  templateUrl: './payment-failure.component.html',
  styleUrls: ['./payment-failure.component.scss']
})
export class PaymentFailureComponent {
  constructor(metaService: MetaService) {
    metaService.setFromConfig('page', 'payment-failure');
  }
}
