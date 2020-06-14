import { Component } from '@angular/core';

import { MetaService } from '../../../meta/services/meta.service';

@Component({
  selector: 'app-payment-cancel',
  templateUrl: './payment-cancel.component.html',
  styleUrls: ['./payment-cancel.component.scss']
})
export class PaymentCancelComponent {
  constructor(metaService: MetaService) {
    metaService.setFromConfig('page', 'payment-cancel');
  }
}
