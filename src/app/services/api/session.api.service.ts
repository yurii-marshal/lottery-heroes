import { Injectable } from '@angular/core';
import { ConfigService } from '../../modules/ex-core/services/config.service';
import { BrandParamsService } from '../../modules/brand/services/brand-params.service';
import { BaseApiService } from '../../modules/api/base.api.service';

@Injectable()
export class SessionApiService {
  systemId: string;
  brandId: string;

  constructor(private baseApiService: BaseApiService,
              private configService: ConfigService,
              private brandParamsService: BrandParamsService) {

    this.systemId = this.configService.getConfig('customer', 'system_id');
    this.brandId = this.brandParamsService.getBrandId();
  }

  autologin() {
    const body = {system_id: this.systemId, brand_id: this.brandId};
    return this.baseApiService.post('/auth/autologin/', body);
  }

  extensionSession(lastActivity) {
    const body = {system_id: this.systemId, last_activity: lastActivity};
    return this.baseApiService.post('/auth/extend_session/', body);
  }

}
