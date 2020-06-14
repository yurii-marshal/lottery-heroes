import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { MetaService } from '../../../../../modules/meta/services/meta.service';
import { AnalyticsDeprecatedService } from '../../../../../modules/analytics-deprecated/services/analytics-deprecated.service';
import { LotteriesService } from '../../../../../services/lotteries/lotteries.service';
import { DrawsService } from '../../../../../services/lotteries/draws.service';
import { Cart2Service } from '../../../../../services/cart2/cart2.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DeviceService } from '../../../../../services/device/device.service';
import { DeviceType } from '../../../../../services/device/entities/types/device.type';
import { BrandParamsService } from '../../../../../modules/brand/services/brand-params.service';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../../../../store/reducers/index';
import * as authActions from '../../../../../store/actions/auth.actions';
import { combineLatest } from 'rxjs/observable/combineLatest';

@Component({
  selector: 'app-auth-container',
  templateUrl: './auth-container.component.html',
  styleUrls: ['./auth-container.component.scss'],
})

export class AuthContainerComponent implements OnInit, OnDestroy {
  // BrandParams
  isShowChat: boolean;

  activeAuthComponent = 'signup';
  activeComponent;
  authMobileState = 'inactive';
  emailForReset;
  device: DeviceType;
  queryParamsSubscription: Subscription;
  storeGetRedirectUrl: Subscription;
  @ViewChild('signup') signup: ElementRef;
  @ViewChild('signin') signin: ElementRef;
  @ViewChild('fpassword') fpassword: ElementRef;
  @ViewChild('registerForbiddenCountry') regForbiddenCountry: ElementRef;
  @ViewChild('loginForbiddenCountry') loginForbiddenCountry: ElementRef;
  @ViewChild('statusSelfExcluded') statusSelfExcluded: ElementRef;
  @ViewChild('statusBlocked') statusBlocked: ElementRef;
  @ViewChild('statusClosed') statusClosed: ElementRef;
  nameComponentAfterDoneAnimation: string;

  private savedEmailSubject$: BehaviorSubject<string>;
  savedEmail$: Observable<string>;
  authRedirectUrl: string;
  aliveSubscriptions = true;

  constructor(private store: Store<fromRoot.State>,
              private router: Router,
              private metaService: MetaService,
              private analyticsDeprecatedService: AnalyticsDeprecatedService,
              private lotteriesService: LotteriesService,
              private drawsService: DrawsService,
              private cart2Service: Cart2Service,
              private renderer: Renderer2,
              private deviceService: DeviceService,
              private brandParamsService: BrandParamsService) {

    this.savedEmailSubject$ = new BehaviorSubject(null);
    this.savedEmail$ = this.savedEmailSubject$.asObservable();
    this.storeGetRedirectUrl = this.store.select(fromRoot.getAuthRedirectUrl)
      .takeWhile(() => this.aliveSubscriptions)
      .subscribe(
      (url: string) => this.authRedirectUrl = url
    );
  }

  ngOnInit() {
    this.metaService.setFromConfig('page', 'signup');
    this.deviceService.getDevice().subscribe(device => {
      this.device = device;
      this.onChangeDevice(device);
    });
    this.onTrackOpenAuthComponent(this.activeAuthComponent);

    this.brandParamsService.getConfig('isShowChat').subscribe(configValue => this.isShowChat = configValue);
    this.activeAuthComponent = this.getActiveAuthComponent();
  }

  getActiveAuthComponent(): string {
    const url = this.router.url;
    let activeComponent = 'signup';
    if (url.startsWith('/signup')) {
      activeComponent = 'signup';
    } else if (url.startsWith('/login')) {
      activeComponent = 'signin';
    } else if (url.startsWith('/forgot-password')) {
      activeComponent = 'forgot-password';
    }
    return activeComponent;
  }

  onChangeDevice(device) {
    if (device === 'desktop' && this.activeAuthComponent) {
      this.activeAuthComponent = 'signup';
      if (this.signin) {
        this.renderer.removeClass(this.signin.nativeElement, 'fade-in-left');
      }
    }
  }

  placeEmail(email: string) {
    this.savedEmailSubject$.next(email);
  }

  showComponent(nameComponent: string, animationComponent?) {
    if (this.device === 'desktop') {
      this.animationComponentsDesktop(nameComponent);
    } else {
      this.animationComponentsMobile(nameComponent);
    }
    this.onTrackOpenAuthComponent(nameComponent);
  }

  animationComponentsMobile(nameComponent: string) {
    this.activeAuthComponent = nameComponent;
  }

  isShowComponent(nameComponent: string) {
    let isShow = false;
    if (this.device === 'desktop') {
      if (this.activeAuthComponent === 'signup' ||
          this.activeAuthComponent === 'signin' ||
          this.activeAuthComponent === 'forgot-password' ||
          this.activeAuthComponent === 'register-forbidden-country' ||
          this.activeAuthComponent === 'login-forbidden-country' ||
          this.activeAuthComponent === 'forgot-password' ||
          this.activeAuthComponent === 'status-self-excluded' ||
          this.activeAuthComponent === 'status-blocked' ||
          this.activeAuthComponent === 'status-closed') {
        isShow = true;
      }
    } else {
      if (nameComponent === this.activeAuthComponent) {
        isShow = true;
      }
    }
    return isShow;
  }

  animationComponentsDesktop(nameComponent: string) {
    switch (nameComponent) {
      case 'signin':
        if (this.activeAuthComponent === 'signup') {
          this.renderer.addClass(this.signin.nativeElement, 'fade-in-left');
          this.renderer.removeClass(this.signup.nativeElement, 'fade-in-left');
          this.renderer.addClass(this.signup.nativeElement, 'fade-out-left');
        } else {
          this.renderer.removeClass(this.fpassword.nativeElement, 'fade-in-left');
          this.renderer.removeClass(this.signin.nativeElement, 'fade-out-left');
          this.renderer.addClass(this.signin.nativeElement, 'fade-in-left');
        }
        break;
      case 'forgot-password':
        this.renderer.removeClass(this.signin.nativeElement, 'fade-in-left');
        this.renderer.addClass(this.signin.nativeElement, 'fade-out-left');
        this.renderer.addClass(this.fpassword.nativeElement, 'fade-in-left');
        break;
      case 'signup':
        this.renderer.removeClass(this.signup.nativeElement, 'fade-out-left');
        this.renderer.addClass(this.signup.nativeElement, 'fade-in-left');
        this.renderer.removeClass(this.signin.nativeElement, 'fade-in-left');
        this.renderer.removeClass(this.regForbiddenCountry.nativeElement, 'fade-in-left');
        this.renderer.removeClass(this.loginForbiddenCountry.nativeElement, 'fade-in-left');
        break;
      case 'register-forbidden-country':
        this.renderer.addClass(this.regForbiddenCountry.nativeElement, 'fade-in-left');
        this.renderer.removeClass(this.regForbiddenCountry.nativeElement, 'fade-out-left');
        this.renderer.removeClass(this.signup.nativeElement, 'fade-in-left');
        break;
      case 'login-forbidden-country':
        this.renderer.addClass(this.loginForbiddenCountry.nativeElement, 'fade-in-left');
        this.renderer.removeClass(this.loginForbiddenCountry.nativeElement, 'fade-out-left');
        this.renderer.removeClass(this.signin.nativeElement, 'fade-in-left');
        break;
      case 'status-self-excluded':
        this.renderer.addClass(this.statusSelfExcluded.nativeElement, 'fade-in-left');
        this.renderer.removeClass(this.signin.nativeElement, 'fade-in-left');
        this.renderer.removeClass(this.signup.nativeElement, 'fade-out-left');
        break;
      case 'status-blocked':
        this.renderer.addClass(this.statusBlocked.nativeElement, 'fade-in-left');
        this.renderer.removeClass(this.signin.nativeElement, 'fade-in-left');
        this.renderer.removeClass(this.signup.nativeElement, 'fade-out-left');
        break;
      case 'status-closed':
        this.renderer.addClass(this.statusClosed.nativeElement, 'fade-in-left');
        this.renderer.removeClass(this.signin.nativeElement, 'fade-in-left');
        this.renderer.removeClass(this.signup.nativeElement, 'fade-out-left');
        break;
    }
    this.activeAuthComponent = nameComponent;
  }


  onSuccessSignin() {
    this.router.navigateByUrl(this.authRedirectUrl, {replaceUrl: true});
    this.store.dispatch(new authActions.SetRedirectUrl('/'));
    this.onTrackLoginSuccess();
  }

  onSaveEmail(email: string) {
    this.emailForReset = email;
    this.onTrackRecoverySubmitted();
  }

  onTrackOpenAuthComponent(nameComponent: string) {
    switch (nameComponent) {
      case 'signup':
        if (this.authRedirectUrl === '/cashier') {
          combineLatest(
            this.lotteriesService.getLotteriesMap().filter(lotteries => !!lotteries),
            this.drawsService.getUpcomingDrawsMap().filter(draws => !!draws),
            this.cart2Service.getItems$()
          )
            .first()
            .subscribe(data => {
              this.analyticsDeprecatedService.trackOpenRegistration('checkout', {
                lotteriesMap: data[0],
                upcomingDrawsMap: data[1],
                cartItems: data[2]
              });
            });
        } else {
          this.analyticsDeprecatedService.trackOpenRegistration('external');
        }
        break;
      case 'signin':
        this.analyticsDeprecatedService.trackOpenLogin('checkout');
        break;
      case 'forgot-password':
        this.analyticsDeprecatedService.trackOpenRecoveryForm('checkout');
        break;
    }
  }

  onTrackLoginSuccess() {
    this.analyticsDeprecatedService.trackLoginSuccess('checkout');
  }

  onTrackRecoverySubmitted() {
    this.analyticsDeprecatedService.trackRecoverySubmitted('checkout');
  }

  onTrackLiveChatClicked(): void {
    this.store.dispatch(new authActions.ClickLiveChatRegistration());
  }

  onTrackContactUsClicked(): void {
    this.store.dispatch(new authActions.ClickContactUsRegistration());
  }

  ngOnDestroy() {
    this.storeGetRedirectUrl.unsubscribe();
    this.aliveSubscriptions = false;
  }
}
