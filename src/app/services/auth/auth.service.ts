import {Inject, Injectable, NgZone, PLATFORM_ID} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {CustomerInterface} from './entities/interfaces/customer.interface';
import {CustomerApiService} from '../api/customer.api.service';
import {CustomerService} from './customer.service';
import {CustomerStatsInterface} from './entities/interfaces/customer-stats.interface';
import {SessionsService} from './sessions.service';
import {WebStorageService} from '../storage/web-storage.service';
import {CartCustomerService} from '../cart2/cart-customer.service';
import {Cart2Service} from '../cart2/cart2.service';
import {CartItemModel} from '../../models/cart/cart-item.model';

import {Store} from '@ngrx/store';
import * as fromRoot from '../../store/reducers/index';
import * as authActions from '../../store/actions/auth.actions';
import {GlobalService} from '../global.service';
import {LightboxesService} from '../../modules/lightboxes/services/lightboxes.service';
import {isPlatformBrowser} from '@angular/common';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {TranslateService} from '@ngx-translate/core';
import {BrandParamsService} from '../../modules/brand/services/brand-params.service';
import {getAllBrands} from 'package-brands';
import {EnvironmentService} from '../environment/environment.service';
import {WindowService} from '../device/window.service';
import {FreshChatService} from '../freshChat.service';
import {CookieService} from '../cookieService';

@Injectable()
export class AuthService {
  currentUser: CustomerInterface;
  private customerStatsSubject$: BehaviorSubject<CustomerStatsInterface>;
  private customerStats$: Observable<CustomerStatsInterface>;

  langIdEmitter = new BehaviorSubject<string>('en');
  currentLangIdChange = this.langIdEmitter.asObservable();

  private brandId: string;
  private brandsParams: string;
  private defaultLanguage: string;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private store: Store<fromRoot.State>,
              private customerApiService: CustomerApiService,
              private customerService: CustomerService,
              private router: Router,
              private sessionsService: SessionsService,
              private webStorageService: WebStorageService,
              private cart2Service: Cart2Service,
              private cartCustomerService: CartCustomerService,
              private globalService: GlobalService,
              private lightboxesService: LightboxesService,
              private translateService: TranslateService,
              private brandParamsService: BrandParamsService,
              private environmentService: EnvironmentService,
              private freshChatService: FreshChatService,
              private cookieService: CookieService,
              private zone: NgZone) {
    this.brandId = this.brandParamsService.getBrandId();
    this.brandsParams = getAllBrands(this.environmentService.getEnvironmentData('environment'));
    this.defaultLanguage = this.brandsParams[this.brandId]['locales'][0];
    this.customerStatsSubject$ = new BehaviorSubject(null);
    this.customerStats$ = this.customerStatsSubject$.asObservable();
    this.customerService.getCustomer().subscribe(
      res => this.currentUser = res,
    );
  }

  // Auth
  signup(customer: CustomerInterface) {
    if (this.cookieService.getCookie('bTag')) {
      const bTag = JSON.parse(this.cookieService.getCookie('bTag'));
      if (new Date().getTime() <= bTag['expires']) {
        customer['pixel_transaction_id'] = bTag['transaction_id'];
        customer['pixel_info'] = JSON.stringify(bTag);
      }
    }
    customer['lang_id'] = this.defaultLanguage;
    customer['lang_id_current'] = this.translateService.currentLang.match(/[^-]*/i)[0];
    return combineLatest(
      this.customerApiService.signup(customer),
      this.cart2Service.getItems$(),
    )
      .first()
      .map(([res, cartItems]: [any, Array<CartItemModel>]) => {
        document.cookie = 'bTag=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        this.sessionsService.setExpiredSessionTime(res.expires_at);
        this.saveCurrentUserObj(res.user);
        this.setCurrentUserLanguage(res.user);
        this.sessionsService.runTimerForExtendingSession();
        this.storeSessionStatus(res.session_status);

        if (cartItems.length > 0) {
          this.cartCustomerService.updateCustomerCart(cartItems);
        } else {
          this.cartCustomerService.setCustomerCart(res.cart);
        }

        this.freshChatService.setFreshChatCredentials(res.user);

        return res.user;
      });
  }

  transitLangId(id: string) {
    this.langIdEmitter.next(id);
  }

  signin(customer: CustomerInterface) {
    return combineLatest(
      this.customerApiService.signin(customer),
      this.cart2Service.getItems$(),
    )
      .first()
      .map(([res, cartItems]: [any, Array<CartItemModel>]) => {
        this.setCurrentUserLanguage(res['user']);
        this.sessionsService.setExpiredSessionTime(res.expires_at);
        this.saveCurrentUserObj(res.user);
        this.sessionsService.runTimerForExtendingSession();
        this.showLimitedLightBox(res);
        this.storeSessionStatus(res.session_status);

        if (cartItems.length > 0) {
          this.cartCustomerService.updateCustomerCart(cartItems);
        } else {
          this.cartCustomerService.setCustomerCart(res.cart);
        }

        this.freshChatService.setFreshChatCredentials(res.user);

        return res.user;
      });
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  checkLogin(): boolean {
    return !!this.webStorageService.getItem('biglotteryowinExpiredSessionTime');
  }

  logout() {
    return this.customerApiService.logout().subscribe(
      res => {
        this.sessionsService.deleteExpiredSessionTime();
        this.clearCurrentUser();
      },
      error => {
        this.sessionsService.deleteExpiredSessionTime();
        this.clearCurrentUser();
      }
    );
  }

  passwordResetInit(email: string) {
    return this.customerApiService.passwordResetInit(email);
  }

  // User
  getCurrentSession() {
    return this.customerApiService.getCurrentSession()
      .subscribe(
        user => {
          this.saveCurrentUserObj(user);
          return user;
        },
        error => {
        });
  }

  selfExclusion(endDatetime: string) {
    return this.customerApiService.selfExclusion(endDatetime)
      .subscribe(
        res => {
          this.clearCurrentUser();
          this.sessionsService.deleteExpiredSessionTime();
          const lang_id = this.translateService.currentLang === 'en' ? null : this.translateService.currentLang;
          this.router.navigate(['', lang_id]);
        },
        error => console.error('selfExclusion error', error)
      );
  }

  getCurrentCustomer() {
    return this.customerApiService.getCurrentCustomer();
  }

  updatedUser(customer: any) {
    return this.customerApiService.updateCustomer(customer)
      .map(res => {
        this.saveCurrentUserObj(res);
        return res;
      });
  }

  passwordUpdate(passwords: any) {
    return this.customerApiService.passwordUpdate(passwords);
  }

  passwordReset(passwords: any) {
    return this.customerApiService.passwordReset(passwords);
  }

  clearCurrentUser() {
    this.customerService.setCustomer(null);
    this.freshChatService.logoutFreshChatUser();
    this.translateService.use(`${this.defaultLanguage}-${this.brandId}`);
    this.webStorageService.setItem('current_lang', this.defaultLanguage);
  }

  saveCurrentUserObj(customer) {
    this.customerService.setCustomer(customer);
  }

  setCurrentUserLanguage(customer) {
    if (customer['lang_id_current']) {
      this.translateService.use(`${customer['lang_id_current']}-${this.brandId}`);
      this.webStorageService.setItem('current_lang', customer['lang_id_current']);
      this.transitLangId(customer['lang_id_current']);
    } else {
      this.translateService.use(`${this.defaultLanguage}-${this.brandId}`);
    }
  }

  findAddressByPostcode(postcode) {
    return this.customerApiService.findAddressByPostcode(postcode);
  }

  loadCustomerStats() {
    if (!this.webStorageService.getItem('biglotteryowinExpiredSessionTime')) {
      return;
    }
    this.customerApiService.getCustomerStats()
      .subscribe((customerStats: CustomerStatsInterface) => {
        this.customerStatsSubject$.next(customerStats);
      });
  }

  getCustomerStats() {
    return this.customerStats$;
  }

  storeSessionStatus(status: string) {
    this.store.dispatch(new authActions.SetSessionStatus(status));
  }

  showLimitedLightBox(res): void {
    if (isPlatformBrowser(this.platformId)) {
      if (res.session_status === 'limited') {
        this.zone.runOutsideAngular(() => {
          setTimeout(() => {
            this.zone.run(() => {
              this.lightboxesService.show({
                type: 'general',
                title: 'Lightboxes.sessionStatusTittle',
                message: 'Lightboxes.sessionStatusMessage',
              });
            });
          }, 500);
        });
        return;
      }
    }
  }

  checkAccountVerification(obj) {
    return this.customerApiService.checkAccountVerification(obj);
  }

  resendAccountVerification() {
    return this.customerApiService.resendAccountVerification();
  }
}
