import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalService } from '../../../services/global.service';
import { AuthService } from '../../../services/auth/auth.service';
import { BrandParamsService } from '../../../modules/brand/services/brand-params.service';
import { AltService } from '../../../services/lotteries/alt.service';
import { DeviceService } from '../../../services/device/device.service';
import { Observable } from 'rxjs/Observable';
import { DeviceType } from '../../../services/device/entities/types/device.type';
import { AnalyticsDeprecatedService } from '../../../modules/analytics-deprecated/services/analytics-deprecated.service';
import { Router } from '@angular/router';
import { LotteriesService } from '../../../services/lotteries/lotteries.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  // BrandParams
  showIcons: { [key: string]: boolean };
  protectionIcon: { [key: string]: boolean };
  manageSocialIcons: { [key: string]: boolean };
  showBetVsPlay: boolean;

  lotteryIds: Array<string>;
  brandId: string;

  device$: Observable<DeviceType>;
  private aliveSubscriptions = true;

  constructor(public altService: AltService,
              public globalService: GlobalService,
              private authService: AuthService,
              private brandParamsService: BrandParamsService,
              private deviceService: DeviceService,
              private analyticsDeprecatedService: AnalyticsDeprecatedService,
              private router: Router,
              private lotteriesService: LotteriesService) {
    this.brandId = this.brandParamsService.getBrandId();
  }

  ngOnInit(): void {
    this.brandParamsService.getConfig('footer', 'showIcons')
      .subscribe(configValue => this.showIcons = configValue);

    this.brandParamsService.getConfig('protectionIcon')
      .subscribe(configValue => this.protectionIcon = configValue);

    this.brandParamsService.getConfig('footer', 'manageSocialIcons')
      .subscribe(configValue => this.manageSocialIcons = configValue);

    this.brandParamsService.getConfig('footer', 'lotteryIds')
      .subscribe(configValue => this.lotteryIds = configValue);

    this.brandParamsService.getConfig('footer', 'showBetVsPlay')
      .subscribe(configValue => this.showBetVsPlay = configValue);

    this.device$ = this.deviceService.getDevice().takeWhile(() => this.aliveSubscriptions);
  }

  getLotterySlug(lotteryId: string): Observable<string> {
    return this.lotteriesService.getSlug(lotteryId);
  }

  onWinBtnClicked() {
    if (this.isLoggedIn() === true) {
      this.router.navigate(['/myaccount/details']);
    } else {
      this.globalService.showLightbox$.emit({name: 'auth', value: 'signup'});
    }
    this.onTrackWinButtonClicked();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  onTrackFooterClicked(label: string, linkText: string) {
    this.analyticsDeprecatedService.trackFooterClicked(label, linkText);
  }

  onTrackWinButtonClicked() {
    this.analyticsDeprecatedService.trackFooterWinButtonClicked();
  }

  onTrackSocialIconClicked(socialIcon: string) {
    this.analyticsDeprecatedService.trackSocialIconClicked(socialIcon);
  }

  ngOnDestroy(): void {
    this.aliveSubscriptions = false;
  }
}
