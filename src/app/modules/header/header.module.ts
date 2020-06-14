import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SharedModule} from '../shared/shared.module';
import {CountdownModule} from '../countdown/countdown.module';

import {HeaderComponent} from './components/common/header/header.component';

import {LotteriesMenuListContainerComponent} from './containers/common/lotteries-menu-list.container.component';
import {LotteriesMenuListComponent} from './components/common/lotteries-menu-list/lotteries-menu-list.component';
import {LotteriesMenuListItemContainerComponent} from './containers/common/lotteries-menu-list-item.container.component';
import {LotteriesMenuListItemComponent} from './components/common/lotteries-menu-list-item/lotteries-menu-list-item.component';

import {ResultsMenuListContainerComponent} from './containers/common/results-menu-list.container.component';
import {ResultsMenuListComponent} from './components/common/results-menu-list/results-menu-list.component';
import {ResultsMenuListItemContainerComponent} from './containers/common/results-menu-list-item.container.component';
import {ResultsMenuListItemComponent} from './components/common/results-menu-list-item/results-menu-list-item.component';

import {CartMenuListContainerComponent} from './containers/common/cart-menu-list.container.component';
import {CartMenuListLotteryContainerComponent} from './containers/common/cart-menu-list-lottery.container.component';
import {CartMenuListComboContainerComponent} from './containers/common/cart-menu-list-combo.container.component';
import {CartMenuListComponent} from './components/common/cart-menu-list/cart-menu-list.component';
import {CartMenuListItemComponent} from './components/common/cart-menu-list-item/cart-menu-list-item.component';

import {OffersMenuListContainerComponent} from './containers/common/offers-menu-list.container.component';
import {OffersMenuListItemContainerComponent} from './containers/common/offers-menu-list-item.container.component';
import {OffersMenuListItemMobileComponent} from './components/mobile/offers-menu-list-item-mobile/offers-menu-list-item-mobile.component';
import {OffersMenuListMobileComponent} from './components/mobile/offers-menu-list-mobile/offers-menu-list-mobile.component';

import {MobileMenuComponent} from './components/mobile/mobile-menu/mobile-menu.component';
import {MobileMenuButtonComponent} from './components/mobile/mobile-menu-button/mobile-menu-button.component';
import {LotteriesMenuListMobileComponent} from './components/mobile/lotteries-menu-list-mobile/lotteries-menu-list-mobile.component';
import {
  LotteriesMenuListItemMobileComponent
} from './components/mobile/lotteries-menu-list-item-mobile/lotteries-menu-list-item-mobile.component';
import {ResultsMenuListMobileComponent} from './components/mobile/results-menu-list-mobile/results-menu-list-mobile.component';
import {
  ResultsMenuListItemMobileComponent
} from './components/mobile/results-menu-list-item-mobile/results-menu-list-item-mobile.component';
import {MyAccountComponent} from './components/common/my-account/my-account.component';
import {CloseMobileMenuDirective} from './directives/mobile-menu.directive';
import {
  LotteryWithGreatestJackpotComponent
} from './components/common/lottery-with-greatest-jackpot/lottery-with-greatest-jackpot.component';
import {
  LotteryWithGreatestJackpotDropdownComponent
} from './components/common/lottery-with-greatest-jackpot-dropdown/lottery-with-greatest-jackpot-dropdown.component';
import {OffersMenuListItemComponent} from './components/common/offers-menu-list-item/offers-menu-list-item.component';
import {OffersMenuListComponent} from './components/common/offers-menu-list/offers-menu-list.component';
import {CombosMenuListComponent} from './components/common/combos-menu-list/combos-menu-list.component';
import {CombosMenuListMobileComponent} from './components/mobile/combos-menu-list-mobile/combos-menu-list-mobile.component';
import {CombosMenuListContainerComponent} from './containers/common/combos-menu-list.container.component';
import {CombosMenuListItemComponent} from './components/common/combos-menu-list-item/combos-menu-list-item.component';
import {CombosMenuListItemContainerComponent} from './containers/common/combos-menu-list-item.container.component';
import {CombosMenuListItemMobileComponent} from './components/mobile/combos-menu-list-item-mobile/combos-menu-list-item-mobile.component';
import {CartMenuListSyndicateContainerComponent} from './containers/common/cart-menu-list-syndicate.container.component';
import {MobileLanguageSwitcherComponent} from './components/mobile/mobile-language-switcher/mobile-language-switcher.component';
import {BundlesMenuListItemContainerComponent} from './containers/common/bundles-menu-list-item.container.component';
import {BundlesMenuListContainerComponent} from './containers/common/bundles-menu-list.container.component';
import {BundlesMenuListComponent} from './components/common/bundles-menu-list/bundles-menu-list.component';
import {BundlesMenuListMobileComponent} from './components/mobile/bundles-menu-list-mobile/bundles-menu-list-mobile.component';
import {
  BundlesMenuListItemMobileComponent
} from './components/mobile/bundles-menu-list-item-mobile/bundles-menu-list-item-mobile.component';
import {BundlesMenuListItemComponent} from './components/common/bundles-menu-list-item/bundles-menu-list-item.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    CountdownModule,
  ],
  declarations: [
    HeaderComponent,

    LotteriesMenuListContainerComponent,
    LotteriesMenuListComponent,
    LotteriesMenuListItemContainerComponent,
    LotteriesMenuListItemComponent,

    ResultsMenuListContainerComponent,
    ResultsMenuListComponent,
    ResultsMenuListItemContainerComponent,
    ResultsMenuListItemComponent,

    CartMenuListContainerComponent,
    CartMenuListLotteryContainerComponent,
    CartMenuListComboContainerComponent,
    CartMenuListSyndicateContainerComponent,
    CartMenuListComponent,
    CartMenuListItemComponent,

    OffersMenuListContainerComponent,
    OffersMenuListItemComponent,
    OffersMenuListItemContainerComponent,
    OffersMenuListItemMobileComponent,
    OffersMenuListMobileComponent,
    OffersMenuListComponent,

    CombosMenuListContainerComponent,
    CombosMenuListComponent,
    CombosMenuListMobileComponent,
    CombosMenuListItemContainerComponent,
    CombosMenuListItemComponent,
    CombosMenuListItemMobileComponent,

    BundlesMenuListContainerComponent,
    BundlesMenuListComponent,
    BundlesMenuListMobileComponent,
    BundlesMenuListItemContainerComponent,
    BundlesMenuListItemComponent,
    BundlesMenuListItemMobileComponent,

    MobileMenuComponent,
    MobileMenuButtonComponent,
    LotteriesMenuListMobileComponent,
    LotteriesMenuListItemMobileComponent,
    ResultsMenuListMobileComponent,
    ResultsMenuListItemMobileComponent,
    MyAccountComponent,
    CloseMobileMenuDirective,
    LotteryWithGreatestJackpotComponent,
    LotteryWithGreatestJackpotDropdownComponent,
    MobileLanguageSwitcherComponent
  ],
  exports: [
    HeaderComponent,
  ],
})
export class HeaderModule {
}
