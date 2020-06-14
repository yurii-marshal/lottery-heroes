import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Request } from 'express';

@Injectable()
export class RequestQueryService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              @Inject(DOCUMENT) private document: Document,
              @Optional() @Inject(REQUEST) private request: Request) {
  }

  /**
   * Example localhost:5000 | www.domain.com
   * @returns {string}
   */
  getHost(): string {
    let host: string;

    if (isPlatformServer(this.platformId)) {
      if (this.request === null) {
        throw new Error('Request object in not set.');
      }

      host = this.request.get('host');
    } else if (isPlatformBrowser(this.platformId)) {
      host = this.document.location.host;
    } else {
      throw new Error('Unknown platform.');
    }

    return host;
  }

  /**
   * Example http://localhost:5000 | https://www.domain.com
   * @returns {string}
   */
  getLocationOrigin(): string {
    let locationOrigin: string;

    if (isPlatformServer(this.platformId)) {
      if (this.request === null) {
        throw new Error('Request object in not set.');
      }

      const host = this.request.get('host');
      const protocol = host.lastIndexOf('localhost') === 0 ? 'http' : 'https';
      locationOrigin = `${protocol}://${host}`;
    } else if (isPlatformBrowser(this.platformId)) {
      locationOrigin = this.document.location.origin;
    } else {
      throw new Error('Unknown platform.');
    }

    return locationOrigin;
  }
}
