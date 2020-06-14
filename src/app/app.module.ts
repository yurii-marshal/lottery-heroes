import {APP_INITIALIZER, NgModule, PLATFORM_ID} from '@angular/core';
import {APP_BASE_HREF, CurrencyPipe, DatePipe, isPlatformBrowser, isPlatformServer} from '@angular/common';
import {BrowserModule, BrowserTransferStateModule, TransferState, makeStateKey} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/throttle';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/switchMapTo';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/debounce';
import 'rxjs/add/operator/delayWhen';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/publishLast';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from './modules/brand/services/translate-http-loader';
import {TranslateServerLoader} from './modules/brand/services/translate-server-loader';

import {AnalyticsDeprecatedModule} from './modules/analytics-deprecated/analytics-deprecated.module';
import {ApiServicesModule} from './services/api/api-services.module';
import {StorageServicesModule} from './services/storage/storage-services.module';
import {CacheServicesModule} from './services/cache/cache-services.module';
import {MetaModule} from './modules/meta/meta.module';
import {LotteriesServicesModule} from './services/lotteries/lotteries-services.module';
import {BrandModule} from './modules/brand/brand.module';
import {CmsModule} from './modules/cms/cms.module';

import {AppRoutingModule} from './app-routing.module';
import {ExCoreModule} from './modules/ex-core/ex-core.module';
import {HeaderModule} from './modules/header/header.module';

import {AppComponent} from './app.component';
import {FooterComponent} from './components/common/footer/footer.component';
import {MobileFloatingButtonComponent} from './components/mobile/mobile-floating-button/mobile-floating-button.component';

import {AuthService} from './services/auth/auth.service';
import {RefreshService} from './services/refresh.service';
import {DeviceService} from './services/device/device.service';
import {ScrollService} from './services/device/scroll.service';
import {CustomerService} from './services/auth/customer.service';
import {OfferingsService} from './services/offerings/offerings.service';
import {Cart2SavingService} from './services/cart2/cart2-saving.service';
import {Cart2Service} from './services/cart2/cart2.service';
import {Cart2LotteryService} from './services/cart2/cart2-lottery.service';
import {LuvService} from './services/luv.service';
import {LinesService} from './services/lines.service';
import {WalletService} from './services/wallet.service';

import {SessionsService} from './services/auth/sessions.service';
import {TicketsService} from './services/tickets.service';
import {GlobalService} from './services/global.service';
import {AuthLightboxContainerComponent} from './components/common/lightbox-auth-container/auth-lightbox-container.component';
import {AuthSharedModule} from './modules/auth-shared/auth-shared.module';
import {LightboxLimitedStatusComponent} from './components/common/lightbox-limited-status/lightbox-limited-status.component';
import {CookieModalComponent} from './components/common/cookie-modal/cookie-modal.component';
import {BoSessionComponent} from './components/common/bo-sesssion/bo-session.component';
import {WindowService} from './services/device/window.service';
import {WordpressService} from './services/wordpress/wordpress.service';
import {AccountService} from './services/account/account.service';
import {CurrencyService} from './services/auth/currency.service';
import {HotjarCodeComponent} from './modules/hotjar-code/hotjar-code.component';
import {LightboxLimitedDepositComponent} from './components/common/lightbox-limited-deposit/lightbox-limited-deposit.component';
import {EnvironmentService} from './services/environment/environment.service';
import {LightboxesModule} from './modules/lightboxes/lightboxes.module';
import {CartCustomerService} from './services/cart2/cart-customer.service';
import {environment} from '../environments/environment';
import {ExperimentsService} from './services/experiments/experiments.service';
import {Cart2ComboService} from './services/cart2/cart2-combo.service';
import {CombosService} from './services/combos/combos.service';
import {PackageApiServicesModule} from './modules/api/package-api-services.module';
import {AnalyticsModule} from './plugins/analytics';
import {BrandParamsService} from './modules/brand/services/brand-params.service';
import {first, switchMap, tap} from 'rxjs/operators';

import {ActionReducer, MetaReducer, StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {storeFreeze} from 'ngrx-store-freeze';
import {reducers, State} from './store/reducers';
import {RouterStoreModule} from '@libs/router-store/router-store.module';
import {EnvironmentModule} from '@libs/environment/environment.module';
import {SeoModule} from './modules/seo';
import {BiglotteryowinCoreModule} from '@libs/biglotteryowin-core/biglotteryowin-core.module';
import {APP_CONFIG, appConfig} from './upgraded/configs/app.config';
import {pluginModules} from './upgraded/plugins';
import {ScripterModule} from '@libs/scripter/scripter.module';
import {Cart2SyndicateService} from './services/cart2/cart2-syndicate.service';
import {LightboxAccountUnverifiedComponent} from './components/common/lightbox-account-unverified/lightbox-account-unverified.component';
import {ABTestingService} from './services/ab-testing.service';
import {TransferStateInterceptor} from './services/transferState.interceptor';
import {FreshChatService} from './services/freshChat.service';
import {CookieService} from './services/cookieService';
import {CookiesAcceptanceModule} from './modules/cookies-acceptance/cookies-acceptance.module';
import {BundlesService} from './services/bundles/bundles.service';
import {Cart2BundleService} from './services/cart2/cart2-bundle.service';
import {NgcCookieConsentConfig, NgcCookieConsentModule} from 'ngx-cookieconsent';
import {Page404Module} from './modules/page404/page404.module';

const cookieConfig: NgcCookieConsentConfig = {
  'cookie': {
    'expiryDays': -1,
    'domain': environment.cookieDomain
  },
  'position': 'bottom',
  'theme': 'classic',
  'palette': {
    'popup': {
      'background': '#5f5f5f',
      'text': '#ffffff',
      'link': '#ffffff'
    },
    'button': {
      'background': '#f1d600',
      'text': '#000000',
      'border': 'transparent'
    }
  },
  'type': 'opt-in',
  'content': {
    'header': 'Cookies used on the website!',
    'message': 'To help personalize our content, improve your experience and help refine our service, our website' +
      ' or its third-party tools use cookies. Using our website means you agree to allow us to use cookies in accordance with our',
    'dismiss': 'Dismiss',
    'allow': 'Accept',
    'deny': 'Decline',
    'link': 'Cookies Policy',
    'href': '/about/cookies-policy'
  }
};

let translateLoader: TranslateHttpLoader | TranslateServerLoader | null = null;

export function LoadTranslations(http: HttpClient,
                                 platformId: Object,
                                 brandParamsService: BrandParamsService,
                                 state: TransferState): () => Promise<any> {
  return () => brandParamsService.getLangId()
    .pipe(
      first(),
      switchMap((langId) => {
        const langKey = `${langId}-${brandParamsService.getBrandId()}`;
        return HttpLoaderFactory(http, platformId, state).preload(langKey).pipe(
          tap((translations) => {
            if (isPlatformServer(platformId)) {
              state.set(makeStateKey(langKey), translations);
            }
          })
        );
      }),
    )
    .toPromise();
}

export function HttpLoaderFactory(http: HttpClient,
                                  platformId: Object,
                                  state: TransferState): TranslateHttpLoader | TranslateServerLoader {
  if (translateLoader === null) {
    if (isPlatformBrowser(platformId)) {
      translateLoader = new TranslateHttpLoader(http, state);
    } else if (isPlatformServer(platformId)) {
      translateLoader = new TranslateServerLoader(state);
    } else {
      throw new Error('Unknown platform.');
    }
  }

  return translateLoader;
}

export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function (state: State, action: any): State {
    // console.log('store', store);
    // console.log('action', action);
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? [logger, storeFreeze]
  : [];

@NgModule({
  imports: [
    BrowserModule.withServerTransition({appId: 'app-website-server'}),
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AnalyticsModule,
    SeoModule,
    ExCoreModule.forRoot(),
    BrandModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient, PLATFORM_ID, TransferState]
      }
    }),
    AnalyticsDeprecatedModule.forRoot(),
    ApiServicesModule.forRoot(),
    PackageApiServicesModule.forRoot({
      environment: environment
    }),
    StorageServicesModule.forRoot(),
    CacheServicesModule.forRoot(),
    MetaModule.forRoot(),
    LotteriesServicesModule.forRoot(),
    LightboxesModule.forRoot(),
    // LiveChatModule.forRoot(),

    AppRoutingModule,
    HeaderModule,
    AuthSharedModule,
    CmsModule,

    Page404Module,

    NgcCookieConsentModule.forRoot(cookieConfig),
    CookiesAcceptanceModule,

    StoreModule.forRoot(reducers, {metaReducers}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({logOnly: environment.production}),
    RouterStoreModule,
    BrowserTransferStateModule,
    EnvironmentModule.forRoot(environment),
    ScripterModule,
    BiglotteryowinCoreModule,
    ...pluginModules
  ],
  declarations: [
    AppComponent,
    AuthLightboxContainerComponent,
    FooterComponent,
    MobileFloatingButtonComponent,
    LightboxLimitedStatusComponent,
    LightboxLimitedDepositComponent,
    LightboxAccountUnverifiedComponent,
    CookieModalComponent,
    BoSessionComponent,
    HotjarCodeComponent
  ],
  providers: [
    WindowService,
    {
      provide: APP_INITIALIZER,
      useFactory: LoadTranslations,
      multi: true,
      deps: [HttpClient, PLATFORM_ID, BrandParamsService, TransferState]
    },
    {provide: APP_CONFIG, useValue: appConfig},
    {provide: APP_BASE_HREF, useValue: ''},
    FreshChatService,
    CookieService,
    DeviceService,
    ScrollService,
    AuthService,
    RefreshService,
    CustomerService,
    SessionsService,
    OfferingsService,
    CombosService,
    BundlesService,
    Cart2SavingService,
    Cart2Service,
    Cart2LotteryService,
    Cart2ComboService,
    Cart2BundleService,
    Cart2SyndicateService,
    LuvService,
    LinesService,
    WalletService,
    TicketsService,
    GlobalService,
    WordpressService,
    CurrencyService,
    AccountService,
    EnvironmentService,
    CartCustomerService,
    ExperimentsService,
    ABTestingService,
    DatePipe,
    CurrencyPipe,
    TransferStateInterceptor,
    {provide: HTTP_INTERCEPTORS, useExisting: TransferStateInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(globalService: GlobalService) {
    globalService.removeLangSuffix();
  }
}
