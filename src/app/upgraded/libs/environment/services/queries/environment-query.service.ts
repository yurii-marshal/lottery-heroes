import { Inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '../../tokens/environment.token';

@Injectable()
export class EnvironmentQueryService {
  constructor(@Inject(ENVIRONMENT) private environment: {[key: string]: any}) {
  }

  getValue(key: string, defaultValue?: any): any | undefined {
    return this.environment[key] || defaultValue;
  }
}
