import {NgModule} from '@angular/core';
import {NavigationEnd, Route, Router, RouterModule, Routes} from '@angular/router';

import {AuthGuard} from './modules/ex-core/guards/auth.guard';
import {IsNotAuthGuard} from './modules/ex-core/guards/is-not-auth.quard';
import {BrandParamsService} from './modules/brand/services/brand-params.service';
import {ArraysUtil} from './modules/shared/utils/arrays.util';
import {Page404Component} from './modules/page404/page404.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      /**********************************************************************************************
       * HOME FEATURE
       **********************************************************************************************/
      {
        path: '',
        loadChildren: './pages/home/home.module#HomeModule',
        pathMatch: 'full'
      },
      /**********************************************************************************************
       * RESULTS FEATURE
       **********************************************************************************************/
      {
        path: 'lotteries/results',
        loadChildren: './pages/results/results/results.module#ResultsModule'
      },
      {
        path: 'bonoloto/results',
        loadChildren: './pages/results/results-lottery/results-lottery.module#ResultsLotteryModule',
        data: {lotteryId: 'bonoloto', pageType: 'resultLottery'}
      },
      {
        path: 'el-gordo/results',
        loadChildren: './pages/results/results-lottery/results-lottery.module#ResultsLotteryModule',
        data: {lotteryId: 'el-gordo-primitiva', pageType: 'result-lottery'}
      },
      {
        path: 'eurojackpot/results',
        loadChildren: './pages/results/results-lottery/results-lottery.module#ResultsLotteryModule',
        data: {lotteryId: 'eurojackpot', pageType: 'result-lottery'}
      },
      {
        path: 'euromillions/results',
        loadChildren: './pages/results/results-lottery/results-lottery.module#ResultsLotteryModule',
        data: {lotteryId: 'euromillions-ie', pageType: 'result-lottery'}
      },
      {
        path: 'la-primitiva/results',
        loadChildren: './pages/results/results-lottery/results-lottery.module#ResultsLotteryModule',
        data: {lotteryId: 'la-primitiva', pageType: 'result-lottery'}
      },
      {
        path: 'french-lottery/results',
        loadChildren: './pages/results/results-lottery/results-lottery.module#ResultsLotteryModule',
        data: {lotteryId: 'lotto-fr', pageType: 'result-lottery'}
      },
      {
        path: 'irish-lottery/results',
        loadChildren: './pages/results/results-lottery/results-lottery.module#ResultsLotteryModule',
        data: {lotteryId: 'lotto-ie', pageType: 'result-lottery'}
      },
      {
        path: 'polish-lottery/results',
        loadChildren: './pages/results/results-lottery/results-lottery.module#ResultsLotteryModule',
        data: {lotteryId: 'lotto-pl', pageType: 'result-lottery'}
      },
      {
        path: 'national-lottery/results',
        loadChildren: './pages/results/results-lottery/results-lottery.module#ResultsLotteryModule',
        data: {lotteryId: 'lotto-uk', pageType: 'result-lottery'}
      },
      {
        path: 'mega-millions/results',
        loadChildren: './pages/results/results-lottery/results-lottery.module#ResultsLotteryModule',
        data: {lotteryId: 'megamillions', pageType: 'result-lottery'}
      },
      {
        path: 'mega-sena/results',
        loadChildren: './pages/results/results-lottery/results-lottery.module#ResultsLotteryModule',
        data: {lotteryId: 'megasena', pageType: 'result-lottery'}
      },
      {
        path: 'oz-lotto/results',
        loadChildren: './pages/results/results-lottery/results-lottery.module#ResultsLotteryModule',
        data: {lotteryId: 'oz-lotto-au', pageType: 'result-lottery'}
      },
      {
        path: 'powerball/results',
        loadChildren: './pages/results/results-lottery/results-lottery.module#ResultsLotteryModule',
        data: {lotteryId: 'powerball', pageType: 'result-lottery'}
      },
      {
        path: 'oz-powerball/results',
        loadChildren: './pages/results/results-lottery/results-lottery.module#ResultsLotteryModule',
        data: {lotteryId: 'powerball-au', pageType: 'result-lottery'}
      },
      {
        path: 'superenalotto/results',
        loadChildren: './pages/results/results-lottery/results-lottery.module#ResultsLotteryModule',
        data: {lotteryId: 'superenalotto', pageType: 'result-lottery'}
      },
      {
        path: 'thunderball/results',
        loadChildren: './pages/results/results-lottery/results-lottery.module#ResultsLotteryModule',
        data: {lotteryId: 'thunderball', pageType: 'result-lottery'}
      },
      {
        path: 'megasena/results',
        loadChildren: './pages/results/results-lottery/results-lottery.module#ResultsLotteryModule',
        data: {lotteryId: 'megasena', pageType: 'result-lottery'}
      },
      {
        path: 'lotto-6aus49/results',
        loadChildren: './pages/results/results-lottery/results-lottery.module#ResultsLotteryModule',
        data: {lotteryId: 'lotto-6aus49', pageType: 'result-lottery'}
      },
      {
        path: 'test-lottery/results',
        loadChildren: './pages/results/results-lottery/results-lottery.module#ResultsLotteryModule',
        data: {'lotteryId': 'test-lottery', pageType: 'result-lottery'}
      },
      {
        path: 'bonoloto/results/:dateLocal',
        loadChildren: './pages/results/results-draw/results-draw.module#ResultsDrawModule',
        data: {lotteryId: 'bonoloto', pageType: 'result-draw'}
      },
      {
        path: 'el-gordo/results/:dateLocal',
        loadChildren: './pages/results/results-draw/results-draw.module#ResultsDrawModule',
        data: {lotteryId: 'el-gordo-primitiva', pageType: 'result-draw'}
      },
      {
        path: 'eurojackpot/results/:dateLocal',
        loadChildren: './pages/results/results-draw/results-draw.module#ResultsDrawModule',
        data: {lotteryId: 'eurojackpot', pageType: 'result-draw'}
      },
      {
        path: 'euromillions/results/:dateLocal',
        loadChildren: './pages/results/results-draw/results-draw.module#ResultsDrawModule',
        data: {lotteryId: 'euromillions-ie', pageType: 'result-draw'}
      },
      {
        path: 'la-primitiva/results/:dateLocal',
        loadChildren: './pages/results/results-draw/results-draw.module#ResultsDrawModule',
        data: {lotteryId: 'la-primitiva', pageType: 'result-draw'}
      },
      {
        path: 'french-lottery/results/:dateLocal',
        loadChildren: './pages/results/results-draw/results-draw.module#ResultsDrawModule',
        data: {lotteryId: 'lotto-fr', pageType: 'result-draw'}
      },
      {
        path: 'irish-lottery/results/:dateLocal',
        loadChildren: './pages/results/results-draw/results-draw.module#ResultsDrawModule',
        data: {lotteryId: 'lotto-ie', pageType: 'result-draw'}
      },
      {
        path: 'polish-lottery/results/:dateLocal',
        loadChildren: './pages/results/results-draw/results-draw.module#ResultsDrawModule',
        data: {lotteryId: 'lotto-pl', pageType: 'result-draw'}
      },
      {
        path: 'national-lottery/results/:dateLocal',
        loadChildren: './pages/results/results-draw/results-draw.module#ResultsDrawModule',
        data: {lotteryId: 'lotto-uk', pageType: 'result-draw'}
      },
      {
        path: 'mega-millions/results/:dateLocal',
        loadChildren: './pages/results/results-draw/results-draw.module#ResultsDrawModule',
        data: {lotteryId: 'megamillions', pageType: 'result-draw'}
      },
      {
        path: 'mega-sena/results/:dateLocal',
        loadChildren: './pages/results/results-draw/results-draw.module#ResultsDrawModule',
        data: {lotteryId: 'megasena', pageType: 'result-draw'}
      },
      {
        path: 'oz-lotto/results/:dateLocal',
        loadChildren: './pages/results/results-draw/results-draw.module#ResultsDrawModule',
        data: {lotteryId: 'oz-lotto-au', pageType: 'result-draw'}
      },
      {
        path: 'powerball/results/:dateLocal',
        loadChildren: './pages/results/results-draw/results-draw.module#ResultsDrawModule',
        data: {lotteryId: 'powerball', pageType: 'result-draw'}
      },
      {
        path: 'oz-powerball/results/:dateLocal',
        loadChildren: './pages/results/results-draw/results-draw.module#ResultsDrawModule',
        data: {lotteryId: 'powerball-au', pageType: 'result-draw'}
      },
      {
        path: 'superenalotto/results/:dateLocal',
        loadChildren: './pages/results/results-draw/results-draw.module#ResultsDrawModule',
        data: {lotteryId: 'superenalotto', pageType: 'result-draw'}
      },
      {
        path: 'thunderball/results/:dateLocal',
        loadChildren: './pages/results/results-draw/results-draw.module#ResultsDrawModule',
        data: {lotteryId: 'thunderball', pageType: 'result-draw'}
      },
      {
        path: 'megasena/results/:dateLocal',
        loadChildren: './pages/results/results-draw/results-draw.module#ResultsDrawModule',
        data: {lotteryId: 'megasena', pageType: 'result-draw'}
      },
      {
        path: 'lotto-6aus49/results/:dateLocal',
        loadChildren: './pages/results/results-draw/results-draw.module#ResultsDrawModule',
        data: {lotteryId: 'lotto-6aus49', pageType: 'result-draw'}
      },
      {
        path: 'test-lottery/results/:dateLocal',
        loadChildren: './pages/results/results-draw/results-draw.module#ResultsDrawModule',
        data: {'lotteryId': 'test-lottery', pageType: 'result-draw'}
      },
      /**********************************************************************************************
       * CART FEATURE
       **********************************************************************************************/
      {
        path: 'cart',
        loadChildren: './pages/cart-page/cart-page.module#CartPageModule'
      },
      /**********************************************************************************************
       * CASHIER FEATURE
       **********************************************************************************************/
      {
        path: 'cashier',
        loadChildren: './pages/cashier-page/cashier-page.module#CashierPageModule',
      },
      {
        path: 'cashier/thank-you',
        loadChildren: './pages/thank-you-page/thank-you-page.module#ThankYouPageModule',
      },
      /**********************************************************************************************
       * CUSTOMER FEATURE
       **********************************************************************************************/
      {
        path: 'verify-email/:code',
        loadChildren: './pages/home/home.module#HomeModule',
      },
      {
        path: 'reset-password/:code',
        loadChildren: './pages/customer-feature/reset-password/reset-password.module#ResetPasswordModule'
      },
      {
        path: 'lottery-notification-subscribe/:code',
        loadChildren:
          './pages/customer-feature/lottery-notification-confirmation/' +
          'lottery-notification-confirmation.module#LotteryNotificationConfirmationModule'
      },
      {
        path: 'lottery-notification-unsubscribe/:code',
        loadChildren:
          './pages/customer-feature/lottery-notification-unsubscribe/' +
          'lottery-notification-unsubscribe.module#LotteryNotificationUnsubscribeModule'
      },
      {
        path: 'myaccount',
        loadChildren: './pages/customer-feature/customer-account/customer-account.module#CustomerAccountModule',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
      },
      {
        path: 'signup',
        loadChildren: './pages/customer-feature/auth/auth.module#AuthModule',
        canActivate: [IsNotAuthGuard],
      },
      {
        path: 'login',
        loadChildren: './pages/customer-feature/auth/auth.module#AuthModule',
        canActivate: [IsNotAuthGuard],
      },
      {
        path: 'forgot-password',
        loadChildren: './pages/customer-feature/auth/auth.module#AuthModule',
        canActivate: [IsNotAuthGuard],
      },
      {
        path: 'myaccount/personal-results/:drawId',
        loadChildren: './pages/personal-results/personal-results.module#PersonalResultsModule',
        canActivate: [AuthGuard],
      },
      /**********************************************************************************************
       * STATIC FEATURE
       **********************************************************************************************/
      {
        path: 'about/privacy',
        loadChildren: './pages/static-feature/privacy-policy/privacy-policy.module#PrivacyPolicyModule'
      },
      {
        path: 'about/terms-and-conditions',
        loadChildren: './pages/static-feature/terms-and-conditions/terms-and-conditions.module#TermsAndConditionsModule'
      },
      {
        path: 'about/cookies-policy',
        loadChildren: './pages/static-feature/cookies-policy/cookies-policy.module#CookiesPolicyModule'
      },
      {
        path: 'about/contact',
        loadChildren: './pages/static-feature/contacts/contacts.module#ContactsModule'
      },
      // {
      //   path: 'about',
      //   loadChildren: './pages/static-feature/about-us/about-us.module#AboutUsModule'
      // },
      // {
      //   // ROUTE WILL BE DELETED AT RUNTIME
      //   path: 'about',
      //   loadChildren: './pages/static-feature/uk-version/about-us-uk/about-us-uk.module#AboutUsUkModule'
      // },
      // {
      //   // ROUTE WILL BE DELETED AT RUNTIME
      //   path: 'about',
      //   loadChildren: './pages/static-feature/ie-version/about-us-ie/about-us-ie.module#AboutUsIeModule'
      // },
      // {
      //   path: 'about/about-us',
      //   loadChildren: './pages/static-feature/about-us-inner/about-us-inner.module#AboutUsInnerModule'
      // },
      // {
      //   // ROUTE WILL BE DELETED AT RUNTIME
      //   path: 'about/about-us',
      //   loadChildren: './pages/static-feature/uk-version/about-us-inner-uk/about-us-inner-uk.module#AboutUsInnerUkModule'
      // },
      // {
      //   // ROUTE WILL BE DELETED AT RUNTIME
      //   path: 'about/about-us',
      //   loadChildren: './pages/static-feature/ie-version/about-us-inner-ie/about-us-inner-ie.module#AboutUsInnerIeModule'
      // },
      {
        path: 'about/safe-and-secure',
        loadChildren: './pages/static-feature/uk-version/safe-and-secure-uk/safe-and-secure-uk.module#SafeAndSecureUkModule'
      },
      {
        path: 'about/faq',
        loadChildren: './pages/static-feature/faq/faq.module#FaqModule'
      },
      {
        // ROUTE WILL BE DELETED AT RUNTIME
        path: 'about/faq',
        loadChildren: './pages/static-feature/uk-version/faq-uk/faq-uk.module#FaqUkModule'
      },
      {
        // ROUTE WILL BE DELETED AT RUNTIME
        path: 'about/faq',
        loadChildren: './pages/static-feature/ie-version/faq-ie/faq-ie.module#FaqIeModule'
      },
      {
        path: 'about/bet-vs-play',
        loadChildren: './pages/static-feature/bet-vs-play/bet-vs-play.module#BetVsPlayModule'
      },
      {
        path: 'about/responsible-gaming',
        loadChildren: './pages/static-feature/responsible-gaming/responsible-gaming.module#ResponsibleGamingModule'
      },
      {
        // ROUTE WILL BE DELETED AT RUNTIME
        path: 'about/responsible-gaming',
        loadChildren: './pages/static-feature/uk-version/responsible-gaming-uk/responsible-gaming-uk.module#ResponsibleGamingUkModule'
      },
      {
        path: ':lotterySlug/how-to-play',
        loadChildren: './pages/how-to-play/how-to-play.module#HowToPlayModule'
      },
      {
        path: ':lotterySlug/about',
        loadChildren: './pages/about-lottery-page/about-lottery-page.module#AboutLotteryPageModule'
      },
      {
        path: 'biglotteryowinzone',
        loadChildren: './pages/blog/blog.module#BlogModule'
      },
      /**********************************************************************************************
       * LOTTERIES FEATURE
       **********************************************************************************************/
      {
        path: 'lotteries',
        loadChildren: './pages/lotteries/lotteries.module#LotteriesModule'
      },
      {
        path: 'bonoloto',
        loadChildren: './pages/product/product.module#ProductModule',
        data: {lotteryId: 'bonoloto', pageType: 'lottery'}
      },
      {
        path: 'el-gordo',
        loadChildren: './pages/product/product.module#ProductModule',
        data: {lotteryId: 'el-gordo-primitiva', pageType: 'lottery'}
      },
      {
        path: 'eurojackpot',
        loadChildren: './pages/product/product.module#ProductModule',
        data: {lotteryId: 'eurojackpot', pageType: 'lottery'}
      },
      {
        path: 'euromillions',
        loadChildren: './pages/product/product.module#ProductModule',
        data: {lotteryId: 'euromillions-ie', pageType: 'lottery'}
      },
      {
        path: 'euromillions',
        loadChildren: './pages/product/product.module#ProductModule',
        data: {lotteryId: 'euromillions', pageType: 'lottery'}
      },
      {
        path: 'la-primitiva',
        loadChildren: './pages/product/product.module#ProductModule',
        data: {lotteryId: 'la-primitiva', pageType: 'lottery'}
      },
      {
        path: 'french-lottery',
        loadChildren: './pages/product/product.module#ProductModule',
        data: {lotteryId: 'lotto-fr', pageType: 'lottery'}
      },
      {
        path: 'irish-lottery',
        loadChildren: './pages/product/product.module#ProductModule',
        data: {lotteryId: 'lotto-ie', pageType: 'lottery'}
      },
      {
        path: 'polish-lottery',
        loadChildren: './pages/product/product.module#ProductModule',
        data: {lotteryId: 'lotto-pl', pageType: 'lottery'}
      },
      {
        path: 'national-lottery',
        loadChildren: './pages/product/product.module#ProductModule',
        data: {lotteryId: 'lotto-uk', pageType: 'lottery'}
      },
      {
        path: 'mega-millions',
        loadChildren: './pages/product/product.module#ProductModule',
        data: {lotteryId: 'megamillions', pageType: 'lottery'}
      },
      {
        path: 'mega-sena',
        loadChildren: './pages/product/product.module#ProductModule',
        data: {lotteryId: 'megasena', pageType: 'lottery'}
      },
      {
        path: 'oz-lotto',
        loadChildren: './pages/product/product.module#ProductModule',
        data: {lotteryId: 'oz-lotto-au', pageType: 'lottery'}
      },
      {
        path: 'powerball',
        loadChildren: './pages/product/product.module#ProductModule',
        data: {lotteryId: 'powerball', pageType: 'lottery'}
      },
      {
        path: 'oz-powerball',
        loadChildren: './pages/product/product.module#ProductModule',
        data: {lotteryId: 'powerball-au', pageType: 'lottery'}
      },
      {
        path: 'superenalotto',
        loadChildren: './pages/product/product.module#ProductModule',
        data: {lotteryId: 'superenalotto', pageType: 'lottery'}
      },
      {
        path: 'thunderball',
        loadChildren: './pages/product/product.module#ProductModule',
        data: {lotteryId: 'thunderball', pageType: 'lottery'}
      },
      {
        path: 'megasena',
        loadChildren: './pages/product/product.module#ProductModule',
        data: {lotteryId: 'megasena', pageType: 'lottery'}
      },
      {
        path: 'lotto-6aus49',
        loadChildren: './pages/product/product.module#ProductModule',
        data: {lotteryId: 'lotto-6aus49', pageType: 'lottery'}
      },
      {
        path: 'test-lottery',
        loadChildren: './pages/product/product.module#ProductModule',
        data: {'lotteryId': 'test-lottery', pageType: 'lottery'}
      },
      /**********************************************************************************************
       * DEFAULT
       **********************************************************************************************/
      {
        path: 'combos',
        loadChildren: './pages/combos-page/combos-page.module#CombosPageModule',
      },
      {
        path: 'bundles',
        loadChildren: './pages/bundles-page/bundles-page.module#BundlesPageModule',
      },
      // {
      //   path: '**',
      //   loadChildren: './pages/static-page/static-page.module#StaticPageModule'
      // },
      {
        path: '404',
        component: Page404Component
      },
      {
        path: '**',
        redirectTo: '/404'
      }
    ], {initialNavigation: 'enabled'})
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
  routesList: Array<Object>;

  constructor(private router: Router,
              private brandParamsService: BrandParamsService) {
    this.routesList = [];
    this.initRoutes();
  }

  initRoutes(): void {
    const routes: Routes = this.brandParamsService.getRoutes();

    if (routes) {
      // console.log(routes);
      const initialRoutes = this.filterUniqueRoutes(this.router.config);

      routes.forEach((route: Route) => {
        ArraysUtil.findObjByKeyValue(initialRoutes, 'path', route.path, route);
      });

      this.router.resetConfig(initialRoutes);
    }
  }

  private filterUniqueRoutes(routes: Routes): Routes {
    const pathsSet = new Set();
    const resultRoutes = [];

    routes.forEach((route: Route) => {
      if (!pathsSet.has(route.path)) {
        resultRoutes.push(route);
        pathsSet.add(route.path);
      }
    });

    return resultRoutes;
  }
}
