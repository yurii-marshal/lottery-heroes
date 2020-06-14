import {Component, ElementRef, HostListener, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {GlobalService} from '../../../services/global.service';
import {AnalyticsDeprecatedService} from '../../../modules/analytics-deprecated/services/analytics-deprecated.service';
import {WindowService} from '../../../services/device/window.service';
import {DeviceService} from '../../../services/device/device.service';
import {Subscription} from 'rxjs/Subscription';
import {BrandParamsService} from '../../../modules/brand/services/brand-params.service';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../../store/reducers/index';
import * as authActions from '../../../store/actions/auth.actions';
import {Router} from '@angular/router';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {LightboxesService} from '../../../modules/lightboxes/services/lightboxes.service';

@Component({
  selector: 'app-auth-lightbox-container',
  templateUrl: './auth-lightbox-container.component.html',
  styleUrls: ['./auth-lightbox-container.scss']
})
export class AuthLightboxContainerComponent implements OnInit, OnDestroy {
  // BrandParams
  isShowChat: boolean;
  accountSubmitText: string;

  activeAuthComponent;
  emailForReset;

  private savedEmailSubject$: BehaviorSubject<string>;
  savedEmail$: Observable<string>;

  private deviceSubscription: Subscription;
  winHeight: number;
  private device: string;
  private padding: number;
  authRedirectUrl: string;
  aliveSubscriptions = true;
  storeGetRedirectUrl: Subscription;
  showAccountUnverified = false;

  @ViewChild('scrollContainer') scrollContainer: ElementRef;

  @HostListener('window:resize')
  onWindowResize() {
    if (this.activeAuthComponent === 'signup') {
      this.setScrollableSignupHeight(this.padding);
    }
  }

  constructor(@Inject(DOCUMENT) private document,
              @Inject(PLATFORM_ID) private platformId: Object,
              private store: Store<fromRoot.State>,
              private router: Router,
              private globalService: GlobalService,
              private analyticsDeprecatedService: AnalyticsDeprecatedService,
              private windowService: WindowService,
              private deviceService: DeviceService,
              private elementRef: ElementRef,
              private brandParamsService: BrandParamsService,
              private translateService: TranslateService,
              private lightboxesService: LightboxesService,
              private zone: NgZone) {
    this.savedEmailSubject$ = new BehaviorSubject(null);
    this.savedEmail$ = this.savedEmailSubject$.asObservable();
    this.deviceSubscription = deviceService.getDevice().subscribe(device => this.device = device);
    this.storeGetRedirectUrl = this.store.select(fromRoot.getAuthRedirectUrl)
      .takeWhile(() => this.aliveSubscriptions)
      .subscribe(
        (url: string) => this.authRedirectUrl = url
      );
  }

  ngOnInit() {
    // this.accountSubmitText = 'Create Your Account';
    if (isPlatformBrowser(this.platformId)) {
      this.initLightBox();
    }
    this.brandParamsService.getConfig('isShowChat').subscribe(configValue => this.isShowChat = configValue);
    this.brandParamsService.getConfig('accountUnverified').subscribe(configValue => this.showAccountUnverified = configValue);
  }

  initLightBox() {
    this.globalService.showLightbox$.subscribe(
      params => {
        if (params.name === 'auth') {
          this.activeAuthComponent = params.value;
          this.onTrackOpenAuthComponent(params.value);

          this.zone.runOutsideAngular(() => {
            setTimeout(() => {
              this.zone.run(() => {
                if (this.elementRef.nativeElement.querySelector('.outer')) {
                  // tslint:disable-next-line:max-line-length
                  this.padding = this.windowService.nativeWindow.innerHeight - this.elementRef.nativeElement.querySelector('.outer').offsetHeight;
                  if (this.padding < 0) {
                    this.padding = 125;
                  }

                  this.setScrollableSignupHeight(this.padding);
                }
              });
            }, 150);
          });
        }
        if (this.device === 'mobile') {
          this.document.body.classList.add('fixed');
        }
      }
    );
    this.lightboxesService.getCloseAllEventEmitter().subscribe(() => {
      this.activeAuthComponent = false;
    });
  }

  placeEmail(email: string) {
    this.savedEmailSubject$.next(email);
  }

  showComponent(nameComponent: string) {
    this.activeAuthComponent = nameComponent;
    this.onTrackOpenAuthComponent(nameComponent);

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.zone.run(() => {
          if (this.elementRef.nativeElement.querySelector('.outer')) {
            this.padding = this.windowService.nativeWindow.innerHeight -
              this.elementRef.nativeElement.querySelector('.outer').offsetHeight;
            if (this.padding < 0) {
              this.padding = 125;
            }

            this.setScrollableSignupHeight(this.padding);
          } else {
            this.setScrollableSignupHeight(0);
          }
        });
      }, 50);
    });
  }

  onSuccessSignin() {
    this.onTrackLoginSuccess();
    this.router.navigateByUrl(this.authRedirectUrl);
    this.store.dispatch(new authActions.SetRedirectUrl('/'));
    this.activeAuthComponent = false;
    this.document.body.classList.remove('fixed');
  }

  onCheckIsAccountUnverified() {
    if (isPlatformBrowser(this.platformId) && this.showAccountUnverified) {
      this.activeAuthComponent = false;
      this.globalService.showLightbox$.emit({name: 'account-unverified', value: 'verification email sent'});
    }
  }

  onSaveEmail(email) {
    this.emailForReset = email;
    this.onTrackRecoverySubmitted();
  }

  onCloseLightbox() {
    this.activeAuthComponent = false;
    this.document.body.classList.remove('fixed');
  }

  onTrackOpenAuthComponent(nameComponent: string) {
    switch (nameComponent) {
      case 'signup':
        this.analyticsDeprecatedService.trackOpenRegistration('external');
        break;
      case 'signin':
        this.analyticsDeprecatedService.trackOpenLogin('external');
        break;
      case 'forgot-password':
        this.analyticsDeprecatedService.trackOpenRecoveryForm('external');
        break;
    }
  }

  onTrackLoginSuccess() {
    this.analyticsDeprecatedService.trackLoginSuccess('external');
  }

  onTrackRecoverySubmitted() {
    this.analyticsDeprecatedService.trackRecoverySubmitted('external');
  }

  onTrackCloseRegistration() {
    this.analyticsDeprecatedService.trackCloseRegistration('external');
  }

  setScrollableSignupHeight(padding) {
    if (this.activeAuthComponent === 'signup') {
      if (this.device === 'desktop') {
        this.winHeight = this.windowService.nativeWindow.innerHeight;
        this.scrollContainer.nativeElement.style.height = this.winHeight - padding + 'px';
      } else {
        this.scrollContainer.nativeElement.style.height = '97vh';
      }
    } else {
      this.scrollContainer.nativeElement.style.height = '100%';
    }
  }

  onTrackLiveChatClickedRegistration(): void {
    this.store.dispatch(new authActions.ClickLiveChatRegistration());
  }

  onTrackContactUsClickedRegistration(): void {
    this.store.dispatch(new authActions.ClickContactUsRegistration());
    this.onCloseLightbox();
  }

  ngOnDestroy(): void {
    this.deviceSubscription.unsubscribe();
    this.storeGetRedirectUrl.unsubscribe();
    this.aliveSubscriptions = false;
  }
}
