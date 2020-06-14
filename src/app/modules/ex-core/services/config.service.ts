import { Injectable } from '@angular/core';

const config = {
  common: {
    numberSecondsReloadBalance: 60,
  },
  customer: {
    system_id: 'web',
    login_type_id: 'regular',
  },
};

@Injectable()
export class ConfigService {
  private config;

  constructor() {
    this.config = config;
  }

  public getConfig(group: string, value?: string): any {
    let result;

    if (group && value) {
      result = this.config[group][value];
    } else if (group) {
      result = this.config[group];
    }

    return result;
  }
}
