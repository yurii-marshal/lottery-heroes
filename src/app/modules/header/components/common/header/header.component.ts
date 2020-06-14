import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  ViewChild
} from '@angular/core';
import {getAllBrands} from 'package-brands';
import {NavigationEnd, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {isPlatformBrowser} from '@angular/common';

import {AuthService} from '../../../../../services/auth/auth.service';
import {Cart2Service} from '../../../../../services/cart2/cart2.service';
import {DeviceService} from '../../../../../services/device/device.service';
import {GlobalService} from '../../../../../services/global.service';
import {AnalyticsDeprecatedService} from '../../../../analytics-deprecated/services/analytics-deprecated.service';
import {BrandParamsService} from '../../../../brand/services/brand-params.service';
import {DeviceType} from '../../../../../services/device/entities/types/device.type';
import {AltService} from '../../../../../services/lotteries/alt.service';
import {AccountService} from '../../../../../services/account/account.service';
import {LotteriesService} from '../../../../../services/lotteries/lotteries.service';
import {DrawsService} from '../../../../../services/lotteries/draws.service';
import {OfferingsService} from '../../../../../services/offerings/offerings.service';
import {LotteriesSortService} from '../../../../../services/lotteries/lotteries-sort.service';

import {LotteryBrandInterface, LotteryInterface} from '../../../../api/entities/incoming/lotteries/lotteries.interface';
import {LotteriesMapInterface} from '../../../../../services/lotteries/entities/interfaces/lotteries-map.interface';
import {DrawInterface} from '../../../../api/entities/incoming/lotteries/draws.interface';
import {OfferFreeLinesInterface} from '../../../../api/entities/incoming/offerings/offerings-offers.interface';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../../../../../app/store/reducers';
import * as headerActions from '../../../actions/header.actions';
import {map} from 'rxjs/operators';
import {BrandQueryService} from '@libs/biglotteryowin-core/services/queries/brand-query.service';
import {TranslateService} from '@ngx-translate/core';
import {EnvironmentService} from '../../../../../services/environment/environment.service';
import {CustomerApiService} from '../../../../../services/api/customer.api.service';
import {WebStorageService} from '../../../../../services/storage/web-storage.service';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  device$: Observable<DeviceType>;
  numberOfItemsInCart$: Observable<number>;
  superJackpotLottery$: Observable<LotteryInterface>;
  superJackpotDraw$: Observable<DrawInterface>;
  superJackpotOffer$: Observable<OfferFreeLinesInterface>;

  // BrandParams
  showBetVsPlay: boolean;
  showSupportPhone: boolean;
  lotteryIds: Array<string>;
  showMenuItem: { [key: string]: boolean };
  brandId: string;

  // TranslateParams
  translateLangItems: Array<Object>;
  translateLang: string;

  imgUrl: string;

  private aliveSubscriptions = true;

  private brandsParams;
  public brandLocales;

  @ViewChild('mobileMenu') mobileMenu: ElementRef;
  // @ViewChild('mobileLangSwitcher') mobileLangSwitcher: ElementRef;

  itempropImage$: Observable<string | null>;

  constructor(public altService: AltService,
              private authService: AuthService,
              private cart2Service: Cart2Service,
              private deviceService: DeviceService,
              private globalService: GlobalService,
              private elementRef: ElementRef,
              private renderer: Renderer2,
              private analyticsDeprecatedService: AnalyticsDeprecatedService,
              private brandParamsService: BrandParamsService,
              private router: Router,
              private accountService: AccountService,
              private lotteriesService: LotteriesService,
              private drawsService: DrawsService,
              private offeringsService: OfferingsService,
              private lotteriesSortService: LotteriesSortService,
              @Inject(PLATFORM_ID) private platformId: Object,
              private store: Store<fromRoot.State>,
              private brandQueryService: BrandQueryService,
              private environmentService: EnvironmentService,
              private customerService: CustomerApiService,
              private webStorageService: WebStorageService,
              public translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.brandId = this.brandParamsService.getBrandId();
    this.brandsParams = getAllBrands(this.environmentService.getEnvironmentData('environment'));
    this.brandLocales = this.brandsParams[this.brandId]['locales'];
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
    this.translateService.setDefaultLang(`${this.webStorageService.getItem('current_lang') || this.brandLocales[0]}-${this.brandId}`);
    this.translateService.use(`${this.webStorageService.getItem('current_lang') || this.brandLocales[0]}-${this.brandId}`);
    this.authService.currentLangIdChange.subscribe(data => {
      this.translateLang = this.webStorageService.getItem('current_lang') || data;
    });

    this.device$ = this.deviceService.getDevice().takeWhile(() => this.aliveSubscriptions);
    this.numberOfItemsInCart$ = this.cart2Service.getNumberOfItems$().takeWhile(() => this.aliveSubscriptions);

    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .takeWhile(() => this.aliveSubscriptions)
      .subscribe((event: NavigationEnd) => this.onUrlChange(event.url));

    if (isPlatformBrowser(this.platformId)) {
      this.globalService.showMobileMenuBehaviorSubject$
        .takeWhile(() => this.aliveSubscriptions)
        .subscribe(() => this.toggleMenu());
      // this.globalService.showMobileLanguageSwitcherBehaviorSubject$
      //   .takeWhile(() => this.aliveSubscriptions)
      //   .subscribe(() => this.toggleLanguageDropDownMenu());
    }

    this.brandParamsService.getConfig('header', 'showBetVsPlay')
      .subscribe(configValue => this.showBetVsPlay = configValue);

    this.brandParamsService.getConfig('header', 'showSupportPhone')
      .subscribe(configValue => this.showSupportPhone = configValue);

    this.brandParamsService.getConfig('header', 'lotteryIds')
      .subscribe(configValue => this.lotteryIds = configValue);

    this.brandParamsService.getConfig('aboutPageMenu', 'showMenuItem')
      .subscribe(configValue => this.showMenuItem = configValue);

    this.superJackpotLottery$ = this.lotteriesSortService.getLotterySuperJackpot()
      .switchMap(id => {
        return this.lotteriesService.getLottery(id);
      })
      .publishReplay(1)
      .refCount();

    this.superJackpotDraw$ = this.lotteriesSortService.getLotterySuperJackpot()
      .switchMap(id => {
        return this.drawsService.getUpcomingDraw(id);
      });

    this.superJackpotOffer$ = this.lotteriesSortService.getLotterySuperJackpot()
      .switchMap(id => {
        return this.offeringsService.getLotteryFreeLinesOffer(id);
      });
  }

  toggleMenu(): void {
    const isShownMobileMenu = this.globalService.showMobileMenuBehaviorSubject$.getValue();

    if (isShownMobileMenu === true) {
      Velocity(this.mobileMenu.nativeElement, {translateX: '0rem', opacity: '1'}, {duration: 150});
    } else {
      Velocity(this.mobileMenu.nativeElement, {translateX: '-17rem', opacity: '0'}, {duration: 150});
    }
  }

  hideDropdowns(): void {
    if (isPlatformBrowser(this.platformId)) {
      const dropDowns = this.elementRef.nativeElement.getElementsByClassName('drop-down');
      for (let j = 0; j < dropDowns.length; j++) {
        this.renderer.addClass(dropDowns[j], 'hide');
      }
    }
  }

  showDropdown(target): void {
    this.renderer.removeClass(target, 'hide');
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  showSignupLightbox(): void {
    this.globalService.showLightbox$.emit({name: 'auth', value: 'signup'});
  }

  showSigninLightbox(): void {
    this.globalService.showLightbox$.emit({name: 'auth', value: 'signin'});
  }

  showLanguageSwitcher(): void {
    this.globalService.toggleLanguageSwitcher();
  }

  showAccountMenuMobile() {
    this.accountService.emitClick('from-back');
  }

  onTrackNavigationClicked(titleName: string): void {
    this.analyticsDeprecatedService.trackNavigationClicked(titleName);
  }

  onTrackMegaMenuPresented(megaMenuName: string): void {
    this.analyticsDeprecatedService.trackMegaMenuPresented(megaMenuName);
  }

  private getLotterySlug(lottery: LotteryInterface): string {
    const brand: LotteryBrandInterface = lottery.brands.find((_brand: LotteryBrandInterface) => {
      return _brand.id === this.brandQueryService.getBrandId();
    });

    return brand ? brand.url_slug : '';
  }

  private onUrlChange(url): void {
    this.hideDropdowns();
    this.setItempropImageAttr(url);
  }

  setItempropImageAttr(url) {
    this.itempropImage$ = this.lotteriesService.getLotteriesMap()
      .pipe(
        map((lotteriesMap: LotteriesMapInterface) => {
          return Object.keys(lotteriesMap).some((key: string) => {
            return url.indexOf(this.getLotterySlug(lotteriesMap[key])) >= 0;
          }) ? null : 'image';
        })
      );
  }

  // toggleLanguageDropDownMenu() {
  //   const isShownMobileLanguageSwitcher = this.globalService.showMobileLanguageSwitcherBehaviorSubject$.getValue();
  //
  //   if (isShownMobileLanguageSwitcher === true) {
  //     Velocity(this.mobileLangSwitcher.nativeElement, {translateY: '0%', opacity: '1'}, {duration: 150});
  //   } else {
  //     Velocity(this.mobileLangSwitcher.nativeElement, {translateY: '-120%', opacity: '0'}, {duration: 150});
  //   }
  // }

  onLanguageItemClicked(langItem?: string): void {
    this.globalService.toggleLanguageSwitcher();
    // this.toggleLanguageDropDownMenu();
    if (!langItem) {
      return;
    }
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

  onTrackPhoneNumberClicked() {
    this.analyticsDeprecatedService.trackPhoneNumberClicking();
  }

  oTrackSuperJackpotLotteryClicked(lotteryName: string): void {
    this.store.dispatch(new headerActions.ClickSuperJackpotLottery({lotteryName}));
  }

  oTrackQuickPickClicked({lotteryName, menuName}: { lotteryName: string, menuName: string }): void {
    this.store.dispatch(new headerActions.ClickQuickPick({lotteryName, menuName}));
  }

  oTrackHandPickNumbersClicked({lotteryName, menuName}: { lotteryName: string, menuName: string }): void {
    this.store.dispatch(new headerActions.ClickHandPickNumbers({lotteryName, menuName}));
  }

  ngOnDestroy(): void {
    this.aliveSubscriptions = false;
  }
}
