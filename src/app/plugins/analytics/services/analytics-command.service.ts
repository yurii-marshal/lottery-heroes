import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare const dataLayer: Array<any>;

@Injectable()
export class AnalyticsCommandService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }

  gtmEventToGa(category: string, action: string, label: string, customEventParams?: any): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const eventObj = {
      'event': 'GTM event To GA',
      'GA_event_category': category,
      'GA_event_action': action,
      'GA_event_label': label,
    };

    if (typeof customEventParams === 'object' && customEventParams !== null) {
      Object.keys(customEventParams).forEach(key => {
        eventObj[key] = customEventParams[key];
      });
    }

    dataLayer.push(eventObj);
  }
}
