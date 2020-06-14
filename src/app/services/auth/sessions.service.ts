import {Inject, Injectable, NgZone, PLATFORM_ID} from '@angular/core';
import {CustomerService} from './customer.service';
import {WebStorageService} from '../storage/web-storage.service';
import {SessionApiService} from '../api/session.api.service';
import {Observable} from 'rxjs/Observable';
import {WindowService} from '../device/window.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {GlobalService} from '../global.service';
import {Subject} from 'rxjs/Subject';
import {CartCustomerService} from '../cart2/cart-customer.service';

import {Store} from '@ngrx/store';
import * as fromRoot from '../../store/reducers/index';
import * as authActions from '../../store/actions/auth.actions';
import {LightboxesService} from '../../modules/lightboxes/services/lightboxes.service';
import {BrandParamsService} from '../../modules/brand/services/brand-params.service';
import {VisitorCountryInterface} from '../api/entities/incoming/visitor-country.interface';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {fromEvent} from 'rxjs/observable/fromEvent';
import {of} from 'rxjs/observable/of';
import {FreshChatService} from '../freshChat.service';

@Injectable()
export class SessionsService {
  lastCustomerActivity: string;
  beforeExpiredTime = 60000;
  intervalForActivity = 19 * 60 * 1000;
  private autologinEventSubject$: BehaviorSubject<boolean>;
  private autologinEvent$: Observable<boolean>;
  isFirstAutologin = true;

  requestAutologinSubject$: Subject<boolean>;
  isAutoLoginSent = false;

  constructor(private store: Store<fromRoot.State>,
              @Inject(PLATFORM_ID) private platformId: Object,
              @Inject(DOCUMENT) document: any,
              private sessionApiService: SessionApiService,
              private customerService: CustomerService,
              private webStorageService: WebStorageService,
              private windowService: WindowService,
              private globalService: GlobalService,
              private cartCustomerService: CartCustomerService,
              private lightboxesService: LightboxesService,
              private brandParamsService: BrandParamsService,
              private freshChatService: FreshChatService,
              private zone: NgZone) {
    this.autologinEventSubject$ = new BehaviorSubject(false);
    this.autologinEvent$ = this.autologinEventSubject$.asObservable();
    this.requestAutologinSubject$ = new Subject();

    if (isPlatformBrowser(this.platformId)) {
      fromEvent(this.windowService.nativeWindow, 'scroll')
        .debounceTime(500)
        .subscribe(() => this.onActiveCustomer());

      fromEvent(this.windowService.nativeWindow, 'click')
        .subscribe(() => this.onActiveCustomer());
    }
  }

  initApp() {
    if (this.getExpiredSessionTime()) {
      this.autologin().subscribe();
    } else {
      this.trackFirstChangePage();
      this.checkCountryByBrand();
    }
  }

  autologin(delExpTimeOnError = true) {
    if (this.isAutoLoginSent) {
      return this.requestAutologinSubject$.asObservable();
    }
    this.isAutoLoginSent = true;
    return this.sessionApiService.autologin()
      .map(
        res => {
          this.isAutoLoginSent = false;
          this.saveCurrentUserObj(res.user);
          this.setExpiredSessionTime(res.expires_at);
          this.cartCustomerService.setCustomerCart(res.cart);
          this.runTimerForExtendingSession();
          this.showLimitedLightBox(res);
          this.storeSessionStatus(res.session_status);
          this.trackFirstChangePage();
          this.requestAutologinSubject$.next(true);
          this.freshChatService.setFreshChatCredentials(res.user);
          return true;
        }
      )
      .catch(e => {
        this.isAutoLoginSent = false;
        if (delExpTimeOnError === true) {
          this.deleteExpiredSessionTime();
        }
        this.saveCurrentUserObj(null);
        this.trackFirstChangePage();
        this.requestAutologinSubject$.next(false);
        this.checkCountryByBrand();
        return of(false);
      });
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

      if (res.user.status_id === 'limited') {
        this.zone.runOutsideAngular(() => {
          setTimeout(() => {
            this.zone.run(() => {
              this.globalService.showLightbox$.emit({name: 'limited-status', value: 'afterAuth'});
            });
          }, 500);
        });
        return;
      }
    }
  }

  runTimerForExtendingSession() {
    const timer = new Date(this.getExpiredSessionTime()).getTime() - new Date().getTime();
    if (timer - this.beforeExpiredTime <= 0) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.zone.run(() => {
          if (this.lastCustomerActivity && ((new Date(this.getExpiredSessionTime())
            .getTime() - new Date(this.lastCustomerActivity).getTime()) <= this.intervalForActivity)) {
            this.extensionSession();
          }
        });
      }, timer - this.beforeExpiredTime);
    });
  }

  extensionSession() {
    if (!this.getExpiredSessionTime()) {
      return;
    }
    return this.sessionApiService.extensionSession(this.lastCustomerActivity).subscribe(
      res => {
        this.setExpiredSessionTime(res.expires_at);
        this.runTimerForExtendingSession();
      },
      error => {
      }
    );
  }

  onActiveCustomer() {
    this.onCustomerActivity(Date.now());
  }

  onCustomerActivity(timeNow) {
    this.lastCustomerActivity = new Date(timeNow).toISOString();
    if (this.getExpiredSessionTime()) {
      const expTime = new Date(this.getExpiredSessionTime()).getTime();
      if (expTime < timeNow) {
        this.autologin().subscribe();
      } else if ((expTime - this.beforeExpiredTime < timeNow) && (timeNow < expTime)) {
        this.extensionSession();
      }
    }
  }

  saveCurrentUserObj(customer) {
    this.customerService.setCustomer(customer);
  }

  isSessionExist() {
    let sessionExist = false;
    if (this.getExpiredSessionTime()) {
      const expTime = new Date(this.getExpiredSessionTime()).getTime();
      sessionExist = expTime > Date.now();
    }
    return sessionExist;
  }

  getAutoLoginEvent() {
    return this.autologinEvent$;
  }

  setExpiredSessionTime(time) {
    this.webStorageService.setItem('biglotteryowinExpiredSessionTime', time);
  }

  getExpiredSessionTime() {
    return this.webStorageService.getItem('biglotteryowinExpiredSessionTime');
  }

  deleteExpiredSessionTime() {
    return this.webStorageService.deleteItem('biglotteryowinExpiredSessionTime');
  }

  storeSessionStatus(status: string) {
    this.store.dispatch(new authActions.SetSessionStatus(status));
  }

  private checkCountryByBrand() {
    if (isPlatformBrowser(this.platformId)) {
      this.store.select(fromRoot.getVisitorCountry)
        .filter(vc => Object.keys(vc).length !== 0)
        .first()
        .subscribe((visitorCountry: VisitorCountryInterface) => {
          const brandId = this.brandParamsService.getBrandId();
          if (visitorCountry.country.brand_id && visitorCountry.country.brand_id !== brandId) {
            this.showCountryFromAnotherBrandModal(visitorCountry.country.brand_id);
          }
        });
    }
  }

  private showCountryFromAnotherBrandModal(brandId: string) {
    this.lightboxesService.show({
      type: 'redirection',
      title: 'Lightboxes.redirectionTo' + brandId,
      payload: {
        search: document.location.search,
        host: this.brandParamsService.getBrandSiteUrl(brandId),
        brand: brandId,
      },
    });
  }

  trackFirstChangePage() {
    if (this.isFirstAutologin) {
      this.autologinEventSubject$.next(true);
      this.isFirstAutologin = false;
    }
  }
}
