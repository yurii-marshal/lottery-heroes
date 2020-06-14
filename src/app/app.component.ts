import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  ViewChild
} from '@angular/core';
import {DOCUMENT, isPlatformBrowser, LocationStrategy, PlatformLocation} from '@angular/common';
import {Observable} from 'rxjs/Observable';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationEnd,
  NavigationStart,
  Router,
  RouterState,
  RouterStateSnapshot
} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

import {DeviceType} from './services/device/entities/types/device.type';
import {VisitorCountryInterface} from './services/api/entities/incoming/visitor-country.interface';

import {WindowService} from './services/device/window.service';
import {DeviceService} from './services/device/device.service';
import {SessionsService} from './services/auth/sessions.service';
import {WebStorageService} from './services/storage/web-storage.service';
import {GlobalService} from './services/global.service';
import {Cart2SavingService} from './services/cart2/cart2-saving.service';
import {AuthService} from './services/auth/auth.service';
import {BrandParamsService} from './modules/brand/services/brand-params.service';
import {AnalyticsDeprecatedService} from './modules/analytics-deprecated/services/analytics-deprecated.service';
import {isIE611} from './modules/shared/utils/env/isIE611';
import {ExperimentsService} from './services/experiments/experiments.service';
import {Store} from '@ngrx/store';
import * as authActions from './store/actions/auth.actions';
import {VisitorCountryApiService} from './modules/api/visitor-country.api.service';
import * as windowActions from './store/actions/window.actions';
import {LightboxesService} from './modules/lightboxes/services/lightboxes.service';
import {MetaLinkService} from './modules/seo/services/meta-link.service';
import {getRouterStateUrl, RouterStateUrl} from '@libs/router-store/reducers';
import {RouterReducerState} from '@ngrx/router-store';
import {LotteriesService} from './services/lotteries/lotteries.service';
import {ABTestingService} from './services/ab-testing.service';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {SlugsMapInterface} from './services/lotteries/entities/interfaces/slugs-map.interface';
import {filter, skip, takeWhile, tap} from 'rxjs/operators';
import {FreshChatService} from './services/freshChat.service';
import {CookieService} from './services/cookieService';
import {Subscription} from 'rxjs/Subscription';
import {NgcCookieConsentService, NgcInitializeEvent, NgcStatusChangeEvent} from 'ngx-cookieconsent';
import {EnvironmentService} from './services/environment/environment.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  @HostBinding('class.ga-is-optimizing') @Input() isHideExperimentsElements = true;
  // BrandParams
  isShowChat: boolean;

  device$: Observable<DeviceType>;
  isShownMobileMenu: boolean;
  isShownCookieModal = false;

  boSessionHeader$: Observable<string | undefined>;

  private aliveSubscriptions = true;
  private mc;
  private brandId: string;
  showAccountUnverified = false;

  // keep refs to subscriptions to be able to unsubscribe later
  private popupOpenSubscription: Subscription;
  private popupCloseSubscription: Subscription;
  private initializeSubscription: Subscription;
  private statusChangeSubscription: Subscription;
  private revokeChoiceSubscription: Subscription;

  @ViewChild('blackout')
  blackout: ElementRef;

  hotjarId: string;

  @HostListener('window:popstate')
  OnPopState(): void {
    this.store.dispatch(new windowActions.NavigateBack({url: this.router.url}));
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              @Inject(DOCUMENT) private document: Document,
              private store: Store<RouterReducerState<RouterStateUrl>>,
              private windowService: WindowService,
              private deviceService: DeviceService,
              private analyticsDeprecatedService: AnalyticsDeprecatedService,
              private sessionsService: SessionsService,
              private visitorCountryApiService: VisitorCountryApiService,
              private webStorageService: WebStorageService,
              private activatedRoute: ActivatedRoute,
              private globalService: GlobalService,
              private router: Router,
              private location: LocationStrategy,
              private cart2SavingService: Cart2SavingService,
              private authService: AuthService,
              private brandParamsService: BrandParamsService,
              private lotteriesService: LotteriesService,
              private translateService: TranslateService,
              private renderer: Renderer2,
              private lightboxesService: LightboxesService,
              private metaLinkService: MetaLinkService,
              private experimentsService: ExperimentsService,
              private platformLocation: PlatformLocation,
              private freshChatService: FreshChatService,
              private cookieService: CookieService,
              private elementRef: ElementRef,
              private environmentService: EnvironmentService,
              private ccService: NgcCookieConsentService,
              private http: HttpClient,
              private abTestingService: ABTestingService) {
    experimentsService.switchExperimentalElements.subscribe(($event) => this.switchExperimentalElements($event));
    this.brandId = this.brandParamsService.getBrandId();
    this.boSessionHeader$ = this.globalService.boSessionHeader$.asObservable();
  }

  ngOnInit() {
    // this.http.post('https://www.apsp.biz/pay/FP5a/Checkout.aspx', {}, {
    //   headers: new HttpHeaders({'Content-Type': 'application/json'}),
    //   withCredentials: true
    // })
    //   .subscribe((data) => {
    //     console.log(data);
    //   });
    if (localStorage.getItem('gaminghub_cookies_allowed') === '1') {
      this.ccService.destroy();
      this.initTPLServices();
    } else if (!localStorage.getItem('gaminghub_cookies_allowed')) {
      this.popupOpenSubscription = this.ccService.popupOpen$.subscribe(
        () => {
          console.log(event);
          // you can use this.ccService.getConfig() to do stuff...
        });

      this.popupCloseSubscription = this.ccService.popupClose$.subscribe(
        (event) => {
          console.log(event);
          this.ccService.destroy();
        });

      this.initializeSubscription = this.ccService.initialize$.subscribe(
        (event: NgcInitializeEvent) => {
          console.log(event);
        });
      this.statusChangeSubscription = this.ccService.statusChange$.subscribe(
        (event: NgcStatusChangeEvent) => {
          if (event.status === 'allow') {
            localStorage.setItem('gaminghub_cookies_allowed', '1');
            this.initTPLServices();
          } else {
            const tplNode = this.document.getElementById('third-p-l-scripts');
            while (tplNode.firstChild) {
              tplNode.removeChild(tplNode.firstChild);
            }

            if (localStorage.getItem('gaminghub_cookies_allowed') === '1') {
              const cookies = document.cookie.split(';');
              for (let i = 0; i < cookies.length; i++) {
                const spcook = cookies[i].split('=');
                this.deleteCookie(spcook[0]);
              }
            }
            localStorage.setItem('gaminghub_cookies_allowed', '0');
          }
        });

      this.revokeChoiceSubscription = this.ccService.revokeChoice$.subscribe(
        () => {
          console.log(event);
        });
    } else {
      this.ccService.destroy();
    }

    const refs = this.getAllUrlParams(this.windowService.nativeWindow.location.href);
    if (refs['transaction_id'] && refs['transaction_id'].length > 20) {
      if (!this.cookieService.getCookie('bTag')) {
        this.saveBTagToCookies(refs, 30);
      }
    }

    combineLatest(
      this.router.events,
      this.lotteriesService.getSlugsMap()
    )
      .pipe(
        filter(([event, slugsMap]: [any, SlugsMapInterface]) => event instanceof NavigationEnd),
        takeWhile(() => this.aliveSubscriptions),
        tap(() => this.experimentsService.activate()),
        tap(([event, slugsMap]: [NavigationEnd, SlugsMapInterface]) => this.storeUrl(event.url)),
        tap(([event, slugsMap]: [NavigationEnd, SlugsMapInterface]) => {
          // Track lottery type only on ticket page, otherwise track empty
          const slugsList: string[] = Object.keys(slugsMap).map(key => slugsMap[key]);
          if (!slugsList.some((slug: string) => slug === event.url.substr(1))) {
            this.analyticsDeprecatedService.trackEmptyLotteryType();
          }
        }),
        skip(1)
      )
      .subscribe(([event, slugsMap]: [NavigationEnd, SlugsMapInterface]) => this.onUrlChange(event.url));

    this.onNavigateEnd();
    this.initFastClick();
    this.initLang();
    this.listenAndUpdateCartOnAllTabs();

    this.device$ = this.deviceService.getDevice().takeWhile(() => this.aliveSubscriptions);

    this.globalService.showMobileMenuBehaviorSubject$
      .takeWhile(() => this.aliveSubscriptions)
      .subscribe((value: boolean) => this.isShownMobileMenu = value);

    this.identifyCountryByIp();
    this.sessionsService.initApp();
    this.authService.loadCustomerStats();
    this.checkCashier();

    this.brandParamsService.getConfig('isShowChat')
      .subscribe(configValue => this.isShowChat = configValue);

    this.brandParamsService.getConfig('accountUnverified')
      .subscribe(configValue => this.showAccountUnverified = configValue);

    this.activatedRoute.queryParams.pluck('autologin')
      .filter((autologin: string | undefined) => typeof autologin !== 'undefined')
      .map((autologin: string) => autologin.toLowerCase())
      .filter((autologin: string) => autologin === 'true')
      .takeWhile(() => this.aliveSubscriptions)
      .switchMapTo(this.sessionsService.autologin(false))
      .subscribe();

    this.onCheckIsAccountUnverified();

    this.abTestingService.init();

    this.router.events.filter(event => event instanceof NavigationStart).subscribe((e) => {
      this.globalService.removeLangSuffix();
    });
  }

  initTPLServices() {
    this.brandParamsService.getConfig('hotjarId')
      .subscribe(configValue => this.hotjarId = configValue);

    const s = this.renderer.createElement('script');
    s.type = `text/javascript`;
    s.text = `
              {
                (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:` + this.hotjarId + `,hjsv:5};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
                })(window,document,'//static.hotjar.com/c/hotjar-','.js?sv=');
              }
           `;
    this.renderer.appendChild(this.document.getElementById('third-p-l-scripts'), s);

    const t = this.renderer.createElement('script');
    t.type = `text/javascript`;
    t.text = `
              {
                (function (w, d, s, l, i) {
                  w[l] = w[l] || [];
                  w[l].push({
                    'gtm.start':
                      new Date().getTime(), event: 'gtm.js'
                  });
                  var f = d.getElementsByTagName(s)[0],
                    j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
                  j.async = true;
                  j.src =
                    'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
                  f.parentNode.insertBefore(j, f);
                })(window, document, 'script', 'dataLayer', 'GTM-xxx');
              }
           `;
    this.renderer.appendChild(this.document.getElementById('third-p-l-scripts'), t);

    const u = this.renderer.createElement('script');
    u.type = `text/javascript`;
    u.text = `
              {
                (function (i, s, o, g, r, a, m) {
                  i['GoogleAnalyticsObject'] = r;
                  i[r] = i[r] || function () {
                    (i[r].q = i[r].q || []).push(arguments)
                  }, i[r].l = 1 * new Date();
                  a = s.createElement(o),
                    m = s.getElementsByTagName(o)[0];
                  a.async = 1;
                  a.src = g;
                  m.parentNode.insertBefore(a, m)
                })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
                ga('create', 'UA-xxx-1', 'auto');
                ga('require', 'GTM-xxx');
              }
           `;
    this.renderer.appendChild(this.document.getElementById('third-p-l-scripts'), u);

    const v = this.renderer.createElement('iframe');
    v.src = `https://www.googletagmanager.com/ns.html?id=GTM-xxx`;
    v.height = 0;
    v.width = 0;
    v.style = 'display:none;visibility:hidden';
    this.renderer.appendChild(this.document.getElementById('third-p-l-scripts'), v);
    // this.freshChatService.initFreshChat();
  }

  initFastClick() {
    if (isPlatformBrowser(this.platformId)) {
      const body: any = this.document.body;
      FastClick.attach(body);
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId) && Hammer) {
      this.mc = new Hammer(this.blackout.nativeElement);
      this.mc.on('swipeleft', () => this.toggleMenu());
    }
    this.translateService.onLangChange.subscribe(() => {
      this.reloadRouterLang();
    });
  }

  // @HostListener('document:click', ['$event'])
  // clickout(event) {
  //   if (this.elementRef.nativeElement.contains(event.target)) {
  //     console.log(event.target);
  //   } else {
  //     console.log(event);
  //   }
  // }

  ngOnDestroy(): void {
    this.aliveSubscriptions = false;
    if (isPlatformBrowser(this.platformId) && Hammer && this.mc) {
      this.mc.off('swipeleft');
    }
    this.popupOpenSubscription.unsubscribe();
    this.popupCloseSubscription.unsubscribe();
    this.initializeSubscription.unsubscribe();
    this.statusChangeSubscription.unsubscribe();
    this.revokeChoiceSubscription.unsubscribe();
  }

  deleteCookie(cookiename) {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const expires = ';expires=' + d;
    const name = cookiename;
    const value = '';
    document.cookie = name + '=' + value + expires + '; path=/acc/html';
    console.log(document.cookie);
  }

  getAllUrlParams(url) {
    let queryString = url ? url.split('?')[1] : this.windowService.nativeWindow.location.search.slice(1);
    const obj = {};
    if (queryString) {
      queryString = queryString.split('#')[0];
      const arr = queryString.split('&');

      for (let i = 0; i < arr.length; i++) {
        const a = arr[i].split('=');
        let paramNum;
        let paramName = a[0].replace(/\[\d*\]/, function (v) {
          paramNum = v.slice(1, -1);
          return '';
        });
        let paramValue = typeof(a[1]) === 'undefined' ? '' : a[1];
        if (paramName && paramValue) {
          paramName = paramName.toLowerCase();
          paramValue = paramValue.toLowerCase();

          if (obj[paramName]) {
            if (typeof obj[paramName] === 'string') {
              obj[paramName] = [obj[paramName]];
            }
            if (typeof paramNum === 'undefined') {
              obj[paramName].push(paramValue);
            } else {
              obj[paramName][paramNum] = paramValue;
            }
          } else {
            obj[paramName] = paramValue;
          }
        }
      }
    }
    return obj;
  }

  saveBTagToCookies(data, days) {
    data = {
      transaction_id: data['transaction_id'],
      xparam: data['xparam'],
      campaign: data['campaign'],
      channel: data['channel'],
      offer_id: data['offer_id'],
      aff_id: data['aff_id'],
      creative: data['creative'],
      goal_id: data['goal_id'],
      country_code: data['country_code'],
      trk_sys_id: data['trk_sys_id'],
      test: data['test']
    };
    this.cookieService.setCookie('bTag', data, days);
  }

  toggleMenu(): void {
    this.globalService.toggleMenu();
  }

  private identifyCountryByIp() {
    this.visitorCountryApiService.getVisitorCountry({brandId: this.brandId})
      .subscribe((response: VisitorCountryInterface) => {
        this.store.dispatch(new authActions.SetVisitorCountry(response));
        // show cookie-modal only for United Kingdom
        if (response.country.id === 'GB') {
          this.showCookieModal();
        }
      });
  }

  private showCookieModal(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isShownCookieModal = this.webStorageService.getItem('show-cookie-modal') !== 'hidden';
    }
  }

  hideCookieModal(): void {
    this.webStorageService.setItem('show-cookie-modal', 'hidden');
    this.isShownCookieModal = false;
  }

  private checkCashier() {
    this.activatedRoute.queryParams
      .filter((queryParams) => queryParams['cashier'] === '1')
      .first()
      .subscribe(() => {
        this.globalService.cashier = true;
      });
  }

  private onUrlChange(url: string): void {
    if (isPlatformBrowser(this.platformId)) {
      this.analyticsDeprecatedService.trackChangePage(this.windowService.nativeWindow.location.href, url);
    }
  }

  private onNavigateEnd(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events.filter(event => event instanceof NavigationEnd).subscribe(() => {
        this.router.navigated = false;
        this.document.body.scrollTop = 0;
        this.document.documentElement.scrollTop = 0;
        this.reloadRouterLang();
      });
    }
  }

  private reloadRouterLang() {
    this.globalService.removeLangSuffix();
    let lang = '';
    if (this.translateService.currentLang && this.translateService.currentLang.match(/[^-]*/i)[0] !== 'en') {
      lang = this.translateService.currentLang.match(/[^-]*/i)[0];
    }
    this.location.replaceState('', '', lang + this.router.url, '');
  }

  // @HostListener('window:beforeunload', ['$event'])
  // unloadHandler(event: Event) {
  //   console.log(this.router.url);
  //   this.location.replaceState('', '', this.router.url, '');
  // }

  private listenAndUpdateCartOnAllTabs(): void {
    if (!isPlatformBrowser(this.platformId) || isIE611() === true) {
      return;
    }

    this.renderer.listen('window', 'storage', (event) => {
      if (event.key === this.cart2SavingService.cartItemsStorageKey) {
        this.cart2SavingService.restoreItemsList();
      }
    });
  }

  private initLang(): void {
    const brandId = this.brandParamsService.getBrandId();

    this.brandParamsService.getLangId()
      .subscribe((langId: string) => {
        // this.translateService.setDefaultLang(`${langId}-BIGLOTTERYOWIN_COM`);
        // this.translateService.use(`${langId}-${brandId}`);
      });
  }

  switchExperimentalElements(isHide: boolean) {
    this.isHideExperimentsElements = isHide;
  }

  storeUrl(url: string) {
    if (isPlatformBrowser(this.platformId)) {
      if (url !== '/login' && url !== '/signup' && url !== '/forgot-password') {
        this.store.dispatch(new authActions.SetRedirectUrl(url));
      }
    }
  }

  private onCheckIsAccountUnverified() {
    if (isPlatformBrowser(this.platformId) && this.showAccountUnverified) {
      this.store.select(getRouterStateUrl)
        .takeWhile(() => this.aliveSubscriptions)
        .subscribe(data => {
          if (data.params['code'] && data.queryParams['email']) {
            this.authService.checkAccountVerification({
              email: data.queryParams['email'],
              email_verification_code: data.params['code']
            })
              .subscribe(
                () => {
                  this.globalService.showLightbox$.emit({name: 'account-unverified', value: 'verified successfully'});
                  const lang_id = this.translateService.currentLang === 'en' ? null : this.translateService.currentLang;
                  this.router.navigate(['', lang_id]);
                },
                error => this.globalService.showLightbox$.emit({name: 'account-unverified', value: error})
              );
          }
        });
    }
  }

  onResendConfirmation() {
    this.authService.resendAccountVerification()
      .takeWhile(() => this.aliveSubscriptions)
      .subscribe(
        () => this.globalService.showLightbox$.emit({name: 'account-unverified', value: 'resend successfully'}),
        error => this.globalService.showLightbox$.emit({name: 'account-unverified', value: error})
      );
  }
}
