import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';

import { RouterGoAction } from '@libs/router-store/actions/router.actions';

import { LightboxesService } from '../../../../modules/lightboxes/services/lightboxes.service';
import {
  SyndicatePageActionTypes, SyndicatePageAddToCartAction,
  SyndicatePageShowLinesAction
} from '../actions/syndicate-page.actions';
import { Cart2SyndicateService } from '../../../../services/cart2/cart2-syndicate.service';
import { CartSyndicateItemModel } from '../../../../models/cart/cart-syndicate-item.model';

@Injectable()
export class SyndicatePageEffects {
  constructor(private actions$: Actions,
              private lightboxesService: LightboxesService,
              private cart2SyndicateService: Cart2SyndicateService) {
  }

  @Effect({dispatch: false})
  showLines$ = this.actions$
    .ofType(SyndicatePageActionTypes.SyndicatePageShowLinesAction)
    .pipe(
      tap((action: SyndicatePageShowLinesAction) => {
        this.lightboxesService.show({
          type: 'syndicate',
          title: `${action.payload.lotteryName} ${action.payload.lines.length} lines`,
          payload: {lines: action.payload.lines},
        });
      })
    );

  @Effect()
  addToCart$ = this.actions$
    .ofType(SyndicatePageActionTypes.SyndicatePageAddToCartAction)
    .pipe(
      tap((action: SyndicatePageAddToCartAction) => {
        if (action.payload.sharesAmount > 0) {
          this.cart2SyndicateService.addItems([
            new CartSyndicateItemModel(action.payload.templateId, action.payload.sharesAmount, action.payload.lotteryId)
          ]);
        }
      }),
      map(() => new RouterGoAction({path: ['/cart']}))
    );
}
