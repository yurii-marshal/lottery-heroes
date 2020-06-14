import {Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID, OnInit, Input} from '@angular/core';
import {AuthService} from '../../../../../services/auth/auth.service';
import {Router} from '@angular/router';
import {AnalyticsDeprecatedService} from '../../../../analytics-deprecated/services/analytics-deprecated.service';
import {GlobalService} from '../../../../../services/global.service';
import {isPlatformBrowser} from '@angular/common';
import {AccountService} from '../../../../../services/account/account.service';
import {BrandParamsService} from '../../../../brand/services/brand-params.service';
import {Observable} from 'rxjs/Observable';
import {LotteryInterface} from '../../../../api/entities/incoming/lotteries/lotteries.interface';
import {TranslateService} from '@ngx-translate/core';
import {CustomerApiService} from '../../../../../services/api/customer.api.service';
import {WebStorageService} from '../../../../../services/storage/web-storage.service';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss']
})
export class MobileMenuComponent implements AfterViewInit, OnDestroy, OnInit {
  @Input() superJackpotLottery$: Observable<LotteryInterface>;

  // BrandParams
  showSupportPhone: boolean;
  toggler = true;
  showMenuItem: { [key: string]: boolean };
  showBetVsPlay: boolean;
  isShowChat: boolean;

  // language switcher
  brandId: string;
  translateLangItems: Array<Object>;
  translateLang: string;
  imgUrl: string;

  private mc;

  @ViewChild('mobileMenu')
  mobileMenu: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private authService: AuthService,
              private router: Router,
              private customerService: CustomerApiService,
              private translateService: TranslateService,
              private webStorageService: WebStorageService,
              private analyticsDeprecatedService: AnalyticsDeprecatedService,
              private globalService: GlobalService,
              private accountService: AccountService,
              private brandParamsService: BrandParamsService) {
  }

  ngOnInit() {
    this.brandId = this.brandParamsService.getBrandId();
    this.imgUrl = './assets/images/lang/';
    this.translateLangItems = [
      {key: 'en', emojiIcon: '🇬🇧', name: 'English'},
      // {key: 'fr', emojiIcon: '🇫🇷', name: 'Francais'},
      {key: 'de', emojiIcon: '🇩🇪', name: 'Deutsch'},
      {key: 'sv', emojiIcon: '🇸🇪', name: 'Svenska'},
      {key: 'fi', emojiIcon: '🇫🇮', name: 'Finnish'},
      {key: 'no', emojiIcon: '🇳🇴', name: 'Norks'},
      {key: 'pl', emojiIcon: '🇵🇱', name: 'Polskie'}
    ]; // 'da - 🇩🇰',
    this.brandParamsService.getConfig('header', 'showSupportPhone')
      .subscribe(configValue => this.showSupportPhone = configValue);

    this.brandParamsService.getConfig('aboutPageMenu', 'showMenuItem')
      .subscribe(configValue => this.showMenuItem = configValue);

    this.brandParamsService.getConfig('header', 'showBetVsPlay')
      .subscribe(configValue => this.showBetVsPlay = configValue);

    this.brandParamsService.getConfig('isShowChat')
      .subscribe(configValue => this.isShowChat = configValue);
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId) && Hammer) {
      this.mc = new Hammer(this.mobileMenu.nativeElement);
      this.mc.on('swipeleft', () => this.close());
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && Hammer && this.mc) {
      this.mc.off('swipeleft');
    }
  }

  toggleDropDown(event, link: HTMLElement, dropDown: HTMLElement): void {
    if (event.target.classList.contains('active')) {
      Velocity(dropDown, 'slideDown', {display: 'flex', duration: 200});
      Velocity(link, {rotateZ: '180deg'}, {duration: 200});

      event.target.classList.remove('active');
    } else {
      Velocity(dropDown, 'slideUp', {duration: 200});
      Velocity(link, {rotateZ: '0deg'}, {duration: 200});

      event.target.classList.add('active');
    }
  }

  close(): void {
    this.globalService.toggleMenu();
  }

  onLanguageItemClicked(langItem?: string): void {
    this.globalService.toggleLanguageSwitcher();
    this.webStorageService.setItem('current_lang', langItem);
    this.translateService.use(`${langItem}-${this.brandId}`);
    this.translateLang = langItem;
    if (this.isLoggedIn()) {
      this.customerService.changeSystemLanguage(langItem).subscribe(
        response => this.onSuccessChangeLanguage(response),
        error => this.onErrorChangeLanguage(error)
      );
    }
  }

  onSuccessChangeLanguage(data) {
  }

  onErrorChangeLanguage(data) {
  }

  onLogout() {
    // const lang_id = this.translateService.currentLang === 'en' ? null : this.translateService.currentLang;
    this.router.navigate(['']);
    this.authService.logout();
  }

  onTrackNavigationClicked(titleName: string) {
    this.analyticsDeprecatedService.trackNavigationClicked(titleName);
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  showSignupLightbox() {
    this.globalService.showLightbox$.emit({name: 'auth', value: 'signup'});
  }

  showSigninLightbox() {
    this.globalService.showLightbox$.emit({name: 'auth', value: 'signin'});
  }

  showAccountSection() {
    this.accountService.emitClick('from-menu');
  }
}
