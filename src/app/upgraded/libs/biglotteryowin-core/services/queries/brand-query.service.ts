import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { getApiUrl, getBrandId } from 'package-brands';
import { Observable } from 'rxjs/Observable';
import { filter, map, publishReplay, refCount, switchMapTo, tap } from 'rxjs/operators';

import { EnvironmentQueryService } from '@libs/environment/services/queries/environment-query.service';
import { RequestQueryService } from '@libs/environment/services/queries/request-query.service';

import { BiglotteryowinCoreState } from '../../store/reducers';
import { getBrandsEntities, getBrandsLoaded } from '../../store/selectors/brands.selectors';
import { BrandsLoadAction } from '../../store/actions/brands.actions';

@Injectable()
export class BrandQueryService {
  private brandCurrencyId$: Observable<string>;

  constructor(private environmentQueryService: EnvironmentQueryService,
              private requestQueryService: RequestQueryService,
              private store: Store<BiglotteryowinCoreState>) {
  }

  getBrandId(): string {
    return this.environmentQueryService.getValue(
      'brandId',
      getBrandId(this.requestQueryService.getHost())
    );
  }

  getBrandApiUrl(): string {
    const environment = this.environmentQueryService.getValue('environment', null);

    if (environment === null) {
      throw new Error('Environment value is not set.');
    }

    return getApiUrl(this.getBrandId(), environment);
  }

  getBrandCurrencyId(): Observable<string> {
    if (!this.brandCurrencyId$) {
      this.brandCurrencyId$ = this.store.select(getBrandsLoaded).pipe(
        tap((loaded: boolean) => {
          if (loaded === false) {
            this.store.dispatch(new BrandsLoadAction());
          }
        }),
        filter((loaded: boolean) => loaded === true),
        switchMapTo(this.store.select(getBrandsEntities)),
        map((brandsEntities) => {
          const brandId = this.getBrandId();

          if (typeof brandsEntities[brandId] === 'undefined') {
            throw new Error(`Brand ${brandId} does not exist in brands entities.`);
          }

          return brandsEntities[brandId].currencyId;
        }),
        publishReplay(1),
        refCount(),
      );
    }

    return this.brandCurrencyId$;
  }
}
