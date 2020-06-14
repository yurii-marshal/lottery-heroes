import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class ABTestingService {
  vars: { [p: string]: any } = {};

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  init(): void {
    // if (isPlatformBrowser(this.platformId)) {
    //   window['setDefaultShares'] = this.setDefaultShares.bind(this);
    // }
  }


  // private setDefaultShares(sharesNum: number): void {
  //   this.vars['defaultNumOfShares'] = sharesNum;
  // }
}
