import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class WindowService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }

  get nativeWindow(): any {
    return isPlatformBrowser(this.platformId) ? window : null;
  }
}
