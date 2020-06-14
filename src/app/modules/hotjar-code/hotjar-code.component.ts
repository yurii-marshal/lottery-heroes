import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2} from '@angular/core';
import { BrandParamsService } from '../brand/services/brand-params.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {NgcCookieConsentService, NgcStatusChangeEvent} from 'ngx-cookieconsent';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-hotjar-code',
  template: ' ',
})
export class HotjarCodeComponent implements OnInit, OnDestroy {
  // BrandParams
  hotjarId: string;
  private statusChangeSubscription: Subscription;

  constructor(@Inject(DOCUMENT) private document,
              @Inject(PLATFORM_ID) private platformId: Object,
              private renderer: Renderer2,
              private ccService: NgcCookieConsentService,
              private brandParamsService: BrandParamsService) {
  }

  public ngOnInit() {
    // if (isPlatformBrowser(this.platformId)) {
    //   this.brandParamsService.getConfig('hotjarId')
    //     .subscribe(configValue => this.hotjarId = configValue);
    //
    //   const s = this.renderer.createElement('script');
    //   s.type = `text/javascript`;
    //   s.text = `
    //           {
    //             (function(h,o,t,j,a,r){
    //               h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    //               h._hjSettings={hjid:` + this.hotjarId + `,hjsv:5};
    //               a=o.getElementsByTagName('head')[0];
    //               r=o.createElement('script');r.async=1;
    //               r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    //               a.appendChild(r);
    //             })(window,document,'//static.hotjar.com/c/hotjar-','.js?sv=');
    //           }
    //        `;
    //
    //   this.renderer.appendChild(this.document.body, s);
    // }
  }
  public ngOnDestroy() {
    this.statusChangeSubscription.unsubscribe();
  }

}
