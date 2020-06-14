import { Component, Inject } from '@angular/core';
import { LightboxesService } from '../../services/lightboxes.service';
import { GeneralComponent } from '../general/general.component';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../store/reducers/index';
import * as cartActions from '../../../../store/actions/cart.actions';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-subscriptions-cart-lightbox',
  templateUrl: './subscriptions-cart-lightbox.component.html',
  styleUrls: ['./subscriptions-cart-lightbox.component.scss']
})

export class SubscriptionsCartLightboxComponent extends GeneralComponent {
  lightboxName = 'subscriptions';

  constructor(private store: Store<fromRoot.State>,
              lightboxesService: LightboxesService,
              @Inject(DOCUMENT) document) {
    super(lightboxesService, document);
  }

  onClickSubscribePeriod(payload: {item, period, label}) {
    this.store.dispatch(new cartActions.ChangeRenewPeriod({label: payload.label, value: payload.period}));

    this.isShowlightbox = false;
    this.getBtnByType('renew').handler(payload);
  }
}
