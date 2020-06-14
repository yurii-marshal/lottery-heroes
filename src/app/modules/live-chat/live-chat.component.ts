import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2} from '@angular/core';
import {BrandParamsService} from '../brand/services/brand-params.service';
import {Subscription} from 'rxjs/Subscription';
import {DeviceService} from '../../services/device/device.service';
import {AnalyticsDeprecatedService} from '../analytics-deprecated/services/analytics-deprecated.service';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {WindowService} from '../../services/device/window.service';

@Component({
  selector: 'app-live-chat',
  template: ' ',
})
export class LiveChatComponent implements OnInit, OnDestroy {
  // BrandParams
  liveChatUniqueToken: string;
  clickUnsubscribeFunc: Function;
  deviceSubscription: Subscription;
  device: string;

  constructor(@Inject(DOCUMENT) private document,
              @Inject(PLATFORM_ID) private platformId: Object,
              private renderer: Renderer2,
              private window: WindowService,
              private brandParamsService: BrandParamsService,
              private deviceService: DeviceService,
              private analyticsDeprecatedService: AnalyticsDeprecatedService) {
    this.deviceSubscription = deviceService.getDevice().subscribe(device => this.onChangeDevice(device));
  }

  onChangeDevice(device) {
    this.device = device;
  }

  public ngOnInit() {
    // if (isPlatformBrowser(this.platformId)) {
    //   this.brandParamsService.getConfig('liveChatUniqueToken').subscribe(configValue => this.liveChatUniqueToken = configValue);
      // const s1 = this.renderer.createElement('script');
      // const s2 = this.renderer.createElement('div');
      //
      // s1.type = `text/javascript`;
      // s1.text = `(function () {
      //             var se = document.createElement('script');
      //             se.type = 'text/javascript';
      //             se.async = true;
      //             se.src = '//storage.googleapis.com/code.snapengage.com/js/` + this.liveChatUniqueToken + `.js';
      //             var done = false;
      //             se.onload = se.onreadystatechange = function () {
      //               if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
      //                 done = true;
      //                 /* Place your SnapEngage JS API code below */
      //                 SnapEngage.getAgentStatusAsync(function (online) {
      //                   var buttonImageSrc;
      //                   if (online) {
      //                     if (window.innerWidth < 768) {
      //                       buttonImageSrc = '<i class=\"biglotteryowin-chat\"></i> Live Chat';
      //                     } else {
      //                       buttonImageSrc = 'Live Chat <img src=\"assets/images/svg/chat.svg\">';
      //                     }
      //                   } else {
      //                     if (window.innerWidth < 768) {
      //                       buttonImageSrc = '<i class=\"biglotteryowin-email\"></i> Contact Us';
      //                     } else {
      //                       buttonImageSrc = 'Live Chat (Offline)';
      //                     }
      //                   }
      //                   if (document.getElementById('my-inline-button')) {
      //                     document.getElementById('my-inline-button').innerHTML = buttonImageSrc;
      //                     // OPTIONAL: Hide the floatingbutton on pages where you are using an inline button
      //                     SnapEngage.hideButton();
      //                   }
      //                 });
      //               }
      //             };
      //             var s = document.getElementsByTagName('script')[0];
      //             s.parentNode.insertBefore(se, s);
      //           })();`;
      //
      // s2.innerHTML = `<a onclick="SnapEngage.startLink();" id="my-inline-button" class="live-chat-button"></a>`;
      //
      // this.renderer.appendChild(this.document.body, s1);

      // let liveChatContainerEl: any;
      //
      // if (this.device === 'desktop') {
      //   liveChatContainerEl = this.document.getElementById('live-chat-container-desktop');
      // } else {
      //   liveChatContainerEl = this.document.getElementById('live-chat-container-mobile');
      // }
      //
      // if (typeof liveChatContainerEl !== 'undefined' && liveChatContainerEl !== null) {
      //   this.renderer.appendChild(liveChatContainerEl, s2);
      // }
      //
      // this.clickUnsubscribeFunc = this.renderer.listen(s2, 'click', (event) => {
      //   this.onTrackChatBtnClicked();
      // });
  //   }
  }

  onTrackChatBtnClicked() {
  //   this.analyticsDeprecatedService.trackChatClicking();
  }

  ngOnDestroy() {
    this.deviceSubscription.unsubscribe();
    // if (isPlatformBrowser(this.platformId)) {
      // this.clickUnsubscribeFunc();
    // }
  }

}
