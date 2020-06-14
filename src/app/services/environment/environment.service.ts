import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable()
export class EnvironmentService {

  getEnvironmentData(group: string, value?: string) {
    let result = environment[group];

    if (typeof value !== 'undefined') {
      if (result) {
        result = result[value];
      }
    }

    return result;
  }

}
