import {Inject, Injectable} from '@angular/core';
import {getBrandId, getApiUrl} from 'package-brands';

import {RequestQueryService} from '@libs/environment/services/queries/request-query.service';

@Injectable()
export class BrandService {
  environment: any;

  constructor(@Inject('environment') private env: any,
              private requestQueryService: RequestQueryService) {
    this.environment = env.environment;
  }

  getBrandId(): string {
    let brandId = this.environment['brand_id'];
    if (!brandId) {
      // brandId = getBrandId(this.requestQueryService.getHost());
      brandId = 'BIGLOTTERYOWIN_COM';
    }
    return brandId;
  }

  public getApiUrl() {
    // console.log( getApiUrl(this.getBrandId(), this.environment.environment), this.getBrandId(), this.environment.environment);
    return getApiUrl(this.getBrandId(), this.environment.environment);
  }
}
