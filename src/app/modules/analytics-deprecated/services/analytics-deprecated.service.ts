import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

import { AuthService } from '../../../services/auth/auth.service';
import { CustomerService } from '../../../services/auth/customer.service';
import { WalletService } from '../../../services/wallet.service';
import { OfferingsService } from '../../../services/offerings/offerings.service';
import { LotteriesService } from '../../../services/lotteries/lotteries.service';
import { DrawsService } from '../../../services/lotteries/draws.service';
import { WindowService } from '../../../services/device/window.service';
import { LotteriesSortService } from '../../../services/lotteries/lotteries-sort.service';
import { BrandParamsService } from '../../brand/services/brand-params.service';

import { CustomerInterface } from '../../../services/auth/entities/interfaces/customer.interface';
import { CustomerStatsInterface } from '../../../services/auth/entities/interfaces/customer-stats.interface';
import { BalanceInterface } from '../../../services/api/entities/incoming/wallet/balance.interface';
import { OfferingsPricesMapInterface } from '../../../services/api/entities/incoming/offerings/offerings-prices.interface';
import { DrawsMapInterface } from '../../../services/lotteries/entities/interfaces/draws-map.interface';
import { LotteriesMapInterface } from '../../../services/lotteries/entities/interfaces/lotteries-map.interface';
import { OrderInterface } from '../../../services/api/entities/incoming/wallet/order.interface';
import { LotteriesSortByType } from '../../../services/lotteries/entities/types/lotteries-sort-by.type';
import { SlugsMapInterface } from '../../../services/lotteries/entities/interfaces/slugs-map.interface';
import { DatesUtil } from '../../shared/utils/dates.util';
import { SessionsService } from '../../../services/auth/sessions.service';
import { CurrencyService } from '../../../services/auth/currency.service';
import { CartItemModel } from '../../../models/cart/cart-item.model';
import { CartLotteryItemModel } from '../../../models/cart/cart-lottery-item.model';
import { CartComboItemModel } from '../../../models/cart/cart-combo-item.model';
import { LotteryInterface } from '../../api/entities/incoming/lotteries/lotteries.interface';
import { fromEvent } from 'rxjs/observable/fromEvent';
import {CartBundleItemModel} from '../../../models/cart/cart-bundle-item.model';

declare const dataLayer: Array<any>;

@Injectable()
export class AnalyticsDeprecatedService {
  private static lotteryAutoselectLineClicked = 1;
  private static lotteryAutoSelectAllClicked = 1;
  private static depositErrorCount = 1;

  private customer: CustomerInterface;
  private balance: BalanceInterface;
  private offeringsPrices: OfferingsPricesMapInterface;
  private lotteriesMap: LotteriesMapInterface;
  private upcomingDrawsMap: DrawsMapInterface;
  private slugsMap: { [p: string]: string };
  private sortBy: LotteriesSortByType;
  private siteCurrencyId: string;
  private amount: number;
  private customerStats: CustomerStatsInterface;
  private brandId: string;

  constructor(private authService: AuthService,
              private customerService: CustomerService,
              private walletService: WalletService,
              private offeringsService: OfferingsService,
              private lotteriesService: LotteriesService,
              private drawsService: DrawsService,
              private lotteriesSortService: LotteriesSortService,
              private router: Router,
              private windowService: WindowService,
              private sessionsService: SessionsService,
              private brandParamsService: BrandParamsService,
              private currencyService: CurrencyService,
              private zone: NgZone,
              @Inject(DOCUMENT) private document,
              @Inject(PLATFORM_ID) private platformId: Object) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.sessionsService.getAutoLoginEvent()
      .filter((autologinEvent: boolean) => autologinEvent)
      .subscribe(() => {
        this.trackChangePage(document.location.href, document.location.pathname);
      });

    fromEvent(this.windowService.nativeWindow, 'focus')
      .subscribe(() => this.trackChangePage(document.location.href, document.location.pathname));

    this.customerService.getCustomer()
      .subscribe((customer: CustomerInterface) => this.customer = customer);

    this.walletService.getCustomerBalance()
      .filter((balance: BalanceInterface) => !!balance)
      .subscribe(balance => this.balance = balance);

    this.lotteriesService.getLotteriesMap()
      .subscribe((lotteriesMap: LotteriesMapInterface) => this.lotteriesMap = lotteriesMap);

    this.drawsService.getUpcomingDrawsMap()
      .subscribe((upcomingDrawsMap: DrawsMapInterface) => this.upcomingDrawsMap = upcomingDrawsMap);

    this.lotteriesSortService.getLotteriesSortBy()
      .subscribe((sortBy: LotteriesSortByType) => this.sortBy = sortBy);

    this.offeringsService.getPrices()
      .subscribe((offeringsPrices: OfferingsPricesMapInterface) => this.offeringsPrices = offeringsPrices);

    this.currencyService.getCurrencyId()
      .subscribe((siteCurrencyId: string) => this.siteCurrencyId = siteCurrencyId);

    this.walletService.getCurrentDepositAmount().filter(amount => !!amount).subscribe(amount => this.amount = amount);

    this.authService.getCustomerStats()
      .filter(customerStats => !!customerStats)
      .subscribe((customerStats: CustomerStatsInterface) => this.customerStats = customerStats);

    this.brandId = this.brandParamsService.getBrandId();

    this.lotteriesService.getSlugsMap()
      .subscribe((_slugsMap: SlugsMapInterface) => this.slugsMap = _slugsMap);
  }

  trackLotteryType(lotteryId: string,
                   defaultNumOfLines: number): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const lottery: LotteryInterface = this.lotteriesMap[lotteryId];
    const upcomingDraw = this.upcomingDrawsMap[lottery.id];

    if (!upcomingDraw) {
      return;
    }

    dataLayer.push({
      'lotteryType': [{
        'name': lottery.name,
        'jackpot': upcomingDraw.jackpot,
        'currency': upcomingDraw.currency_id,
        'lotteryCountry': lottery.country_id,
        'timeLeftToBuy': DatesUtil.hoursLeftToDate(upcomingDraw.date),
        'defaultNumOfLines': defaultNumOfLines,
      }]
    });

    // Timeout for executing after tracking page change
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.zone.run(() => {
          dataLayer.push({
            'event': 'eecProductDetails',
            'ecommerce': {
              'detail': {
                'products': [{
                  'name': lottery.name + ' line',
                  'id': lottery.id,
                  'price': OfferingsService.findLotteryLinePrice(this.offeringsPrices, lottery.id, upcomingDraw.id),
                  'brand': 'Biglotteryowin',
                  'category': lottery.country_id,
                  'variant': '1',
                }]
              }
            }
          });
        });
      }, 800);
    });
  }

  trackEmptyLotteryType(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'lotteryType': [{
        'name': '',
        'jackpot': '',
        'currency': '',
        'lotteryCountry': '',
        'timeLeftToBuy': '',
        'defaultNumOfLines': '',
      }]
    });
  }

  trackListImpressions(lotteryIds: Array<string>, listKey: string, variantMap?: {[lotteryId: string]: number}): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Timeout for executing after tracking page change
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.zone.run(() => {
          const impressions = [];

          for (let i = 0; i < lotteryIds.length; i++) {
            const variant = variantMap ? variantMap[lotteryIds[i]] : 1;
            const upcomingDrawId = !!this.upcomingDrawsMap[lotteryIds[i]] ? this.upcomingDrawsMap[lotteryIds[i]].id : null;

            impressions.push({
              'name': this.lotteriesMap[lotteryIds[i]].name + ' line',
              'id': lotteryIds[i],
              'price': OfferingsService.findLotteryLinePrice(this.offeringsPrices, lotteryIds[i], upcomingDrawId),
              'brand': 'Biglotteryowin',
              'category': this.lotteriesMap[lotteryIds[i]].country_id,
              'variant': variant,
              'list': this.getListName(listKey),
              'position': i + 1
            });
          }

          dataLayer.push({
            'event': 'eecImpressions',
            'ecommerce': {
              'currencyCode': this.siteCurrencyId,
              'impressions': impressions,
            }
          });
        });
      }, 800);
    });
  }

  trackLotteryNumberSelect(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'event': 'GTM event To GA',
      'GA_event_category': 'Lottery ticket interactions',
      'GA_event_action': 'ticket interactions - number select',
      'GA_event_label': 'ticket interactions - number select'
    });
  }

  trackLotteryAutoSelectLineClick(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'event': 'GTM event To GA',
      'GA_event_category': 'Lottery ticket interactions',
      'GA_event_action': 'ticket interactions - auto select line - clicked',
      'GA_event_label': 'ticket interactions - auto select line - ' + AnalyticsDeprecatedService.lotteryAutoselectLineClicked
    });
    AnalyticsDeprecatedService.lotteryAutoselectLineClicked++;
  }

  trackLotteryClearLineClick(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'event': 'GTM event To GA',
      'GA_event_category': 'Lottery ticket interactions',
      'GA_event_action': 'ticket interactions - clear line - clicked',
      'GA_event_label': 'ticket interactions - clear line'
    });
  }

  trackLotteryAutoSelectAllEvent(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'event': 'GTM event To GA',
      'GA_event_category': 'Lottery ticket interactions',
      'GA_event_action': 'ticket interactions - auto select all - clicked',
      'GA_event_label': 'auto select all - clicked - ' + AnalyticsDeprecatedService.lotteryAutoSelectAllClicked
    });
    AnalyticsDeprecatedService.lotteryAutoSelectAllClicked++;
  }

  trackLotteryClearAllEvent(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'event': 'GTM event To GA',
      'GA_event_category': 'Lottery ticket interactions',
      'GA_event_action': 'ticket interactions - clear all - clicked',
      'GA_event_label': 'ticket interactions - clear all - clicked'
    });
  }

  trackLotteryAddLinesEvent(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'event': 'GTM event To GA',
      'GA_event_category': 'Lottery ticket interactions',
      'GA_event_action': 'ticket interactions - add lines - clicked',
      'GA_event_label': 'ticket interactions - add lines'
    });
  }

  trackLotteryMoreInfoClick(title: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'event': 'GTM event To GA',
      'GA_event_category': 'Lottery ticket interactions',
      'GA_event_action': 'ticket interactions - more info - clicked',
      'GA_event_label': 'ticket interactions - more info - ' + title
    });
  }

  private getListName(key: string): string {
    const lists = {
      lotteries: 'Lotteries product list - sort by ' + this.sortBy,
      results: 'Results product list',
      cart: 'Cart product list',
      homeTop: 'Homepage top banner list',
      homeCarousel: 'Homepage carousel list',
      homeBottom: 'Homepage bottom list',
    };

    return lists[key];
  }

  /**
   * 3.2 Product promotion clicks
   */
  trackProductPromotionClick(listKey: string,
                             position: number,
                             lottery: LotteryInterface): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const upcomingDrawId = !!this.upcomingDrawsMap[lottery.id] ? this.upcomingDrawsMap[lottery.id].id : null;

    dataLayer.push({
      'event': 'GTM event To GA',
      'GA_event_category': 'Product promotions',
      'GA_event_action': 'play now - clicked',
      'GA_event_label': this.getListName(listKey) + ` - ${lottery.name}`
    });

    dataLayer.push({
      'event': 'productClick',
      'ecommerce': {
        'click': {
          'actionField': {'list': this.getListName(listKey)},
          'products': [{
            'name': lottery.name,
            'id': lottery.id,
            'price': OfferingsService.findLotteryLinePrice(this.offeringsPrices, lottery.id, upcomingDrawId),
            'brand': 'Biglotteryowin',
            'category': lottery.country_id,
            'variant': 1,
            'position': position
          }]
        }
      }
    });
  }

  trackLotteryAddToCartClick(ticketValue: number,
                             discount: number,
                             totalLines: number,
                             lottery: LotteryInterface): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const upcomingDraw = !!this.upcomingDrawsMap[lottery.id] ? this.upcomingDrawsMap[lottery.id] : null;

    dataLayer.push({
      'event': 'GTM event To GA',
      'GA_event_category': 'Lottery ticket interactions',
      'GA_event_action': 'ticket interactions - add to cart - clicked',
      'GA_event_label': ticketValue,
      'discount': discount + '% discount',
      'timeLeftToBuy': upcomingDraw ? DatesUtil.hoursLeftToDate(upcomingDraw.date) + ' hours' : '',
      'totalLines': totalLines,
      'currency': this.siteCurrencyId,
    });

    dataLayer.push({
      'event': 'addToCart',
      'ecommerce': {
        'currencyCode': lottery.currency_id,
        'add': {
          'products': [{
            'name': lottery.name + ' line',
            'id': lottery.id,
            'price': OfferingsService.findLotteryLinePrice(this.offeringsPrices, lottery.id, upcomingDraw.id),
            'brand': 'Biglotteryowin',
            'category': lottery.country_id,
            'variant': '1',
            'quantity': totalLines
          }]
        }
      }
    });
  }

  /**
   * 3.4.1 Cart interactions - Add to cart - clicked
   * @param item
   */
  trackCartAddToCartClick(item: CartItemModel): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (item.type === 'lottery') {
      const lotteryId = (<CartLotteryItemModel>item).lotteryId;
      const totalLines = (<CartLotteryItemModel>item).lines.length;

      const lottery = !!this.lotteriesMap[lotteryId] ? this.lotteriesMap[lotteryId] : null;
      const upcomingDraw = !!this.upcomingDrawsMap[lotteryId] ? this.upcomingDrawsMap[lotteryId] : null;

      dataLayer.push({
        'event': 'GTM event To GA',
        'GA_event_category': 'Cart interactions',
        'GA_event_action': 'cart interactions - add to cart clicked',
        'GA_event_label': 'cart interactions - add to cart',
        'timeLeftToBuy': upcomingDraw ? DatesUtil.hoursLeftToDate(upcomingDraw.date) : '',
        'totalLines': totalLines,
        'currency': this.siteCurrencyId
      });

      dataLayer.push({
        'event': 'addToCart',
        'ecommerce': {
          'currencyCode': lottery.currency_id,
          'add': {
            'products': [{
              'name': lottery.name + ' line',
              'id': lottery.id,
              'price': OfferingsService.findLotteryLinePrice(this.offeringsPrices, lottery.id, upcomingDraw.id),
              'brand': 'Biglotteryowin',
              'category': lottery.country_id,
              'variant': '1',
              'quantity': 1
            }]
          }
        }
      });
    }
  }

  trackCartRemoveFromCartClick(item: CartItemModel): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'event': 'GTM event To GA',
      'GA_event_category': 'Cart interactions',
      'GA_event_action': 'cart interactions - remove from cart clicked',
      'GA_event_label': 'cart interactions - remove from cart'
    });

    if (item.type === 'lottery') {
      const lotteryId = (<CartLotteryItemModel>item).lotteryId;
      const renewPeriod = (<CartLotteryItemModel>item).renewPeriod;
      const totalLines = (<CartLotteryItemModel>item).lines.length;
      const upcomingDrawId = !!this.upcomingDrawsMap[lotteryId] ? this.upcomingDrawsMap[lotteryId].id : null;

      this.lotteriesService.getLottery(lotteryId)
        .subscribe((lottery: LotteryInterface) => {
          const products = [];
          products.push({
            'name': lottery.name + ' line',
            'id': lotteryId,
            'price': OfferingsService.findLotteryLinePrice(this.offeringsPrices, lottery.id, upcomingDrawId),
            'brand': 'Biglotteryowin',
            'category': lottery.country_id,
            'variant': renewPeriod,
            'quantity': totalLines
          });

          dataLayer.push({
            'event': 'removeFromCart',
            'ecommerce': {
              'remove': {
                'products': products
              }
            }
          });
        });
    }
  }

  trackCartOpenTicketClick(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'event': 'GTM event To GA',
      'GA_event_category': 'Cart interactions',
      'GA_event_action': 'cart interactions - open ticket clicked',
      'GA_event_label': 'cart interactions - open ticket'
    });
  }

  trackCartCloseTicketClick(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'event': 'GTM event To GA',
      'GA_event_category': 'Cart interactions',
      'GA_event_action': 'cart interactions - close ticket clicked',
      'GA_event_label': 'cart interactions - close ticket'
    });
  }

  trackCartEditLineClick(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'event': 'GTM event To GA',
      'GA_event_category': 'Cart interactions',
      'GA_event_action': 'cart interactions - edit line clicked',
      'GA_event_label': 'cart interactions - edit line'
    });
  }

  trackAddFreeLinesClick(lotteryId: string, addFreeLinesText: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'event': 'GTM event To GA',
      'GA_event_category': 'Cart interactions',
      'GA_event_action': 'cart interactions - ticket promotion - clicked',
      'GA_event_label': `cart interactions - ticket promotion - ${lotteryId} - ${addFreeLinesText}`
    });
  }

  trackCartEditLineSaveClick(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'event': 'GTM event To GA',
      'GA_event_category': 'Cart interactions',
      'GA_event_action': 'cart interactions - edit line - save',
      'GA_event_label': 'cart interactions - edit line - save'
    });
  }

  trackCartAddLineClick(lotteryId: string, numberOfLinesAfterAdd: number): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'event': 'GTM event To GA',
      'GA_event_category': 'Cart interactions',
      'GA_event_action': 'cart interactions - add line clicked',
      'GA_event_label': 'cart interactions - add line'
    });
  }

  trackCartRemoveLineClick(lotteryId: string, numberOfLinesAfterAdd: number): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'event': 'GTM event To GA',
      'GA_event_category': 'Cart interactions',
      'GA_event_action': 'cart interactions - remove line - clicked',
      'GA_event_label': `cart interactions - remove line - ${lotteryId} - ${numberOfLinesAfterAdd}`
    });
  }

  trackCartTrashIconClick(item: CartItemModel): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    let id;
    switch (item.type) {
      case 'lottery':
        id = (<CartLotteryItemModel>item).lotteryId;
        break;
      case 'combo':
        id = (<CartComboItemModel>item).comboId;
        break;
        case 'bundle':
        id = (<CartBundleItemModel>item).bundleId;
        break;
      default:
        id = '';
        break;
    }

    dataLayer.push({
      'event': 'GTM event To GA',
      'GA_event_category': 'Cart interactions',
      'GA_event_action': 'cart interactions - trash icon - clicked',
      'GA_event_label': 'cart interactions - trash icon - clicked - ' + item.type + ' ' + id
    });
  }

  trackCartProceedToCheckout(totalPrice: number): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'event': 'GTM event To GA',
      'GA_event_category': 'Cart interactions',
      'GA_event_action': 'cart interactions - proceed to checkout clicked',
      'GA_event_label': 'cart interactions - proceed to checkout - ' + totalPrice
    });
  }

  // Navigation events
  trackNavigationClicked(titleName: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Navigation',
      'GA_event_action': 'navigation - clicked',
      'GA_event_label': `navigation - clicked - ${titleName}`,
      'event': 'GTM event To GA'
    });
  }

  trackMegaMenuPresented(megaMenuName: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Navigation',
      'GA_event_action': 'mega menu presented',
      'GA_event_label': `mega menu presented - ${megaMenuName}`,
      'event': 'GTM event To GA'
    });
  }

  trackMegaMenuClicked(megaMenuName: string, lotteryName: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Navigation',
      'GA_event_action': 'mega menu - clicked',
      'GA_event_label': `mega menu - clicked - ${megaMenuName} - ${lotteryName}`,
      'event': 'GTM event To GA'
    });
  }

  trackChangePage(pageFullUrl: string, url: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Timeout for executing after tracking page change
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.zone.run(() => {
          if (this.authService.isLoggedIn()) {
            if (this.customer && this.customer.cid && this.customer.kyc_status_id) {
              this.trackChangePageAuthorizedCustomer(pageFullUrl, url);
            } else {
              this.authService.getCurrentCustomer().subscribe(
                customer => {
                  this.authService.saveCurrentUserObj(customer);
                  this.trackChangePageAuthorizedCustomer(pageFullUrl, url);
                },
                error => this.authService.clearCurrentUser()
              );
            }
          } else {
            dataLayer.push({
              'loginStatus': 'Not logged',
              'siteBrand': this.brandId,
              'pageRealURL': pageFullUrl,
              'pageType': this.determinePageType(url),
              'event': 'GTM page To GA'
            });
          }
        });
      }, 400);
    });
  }

  private trackChangePageAuthorizedCustomer(pageFullUrl: string, url: string) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'customerBalance': (this.balance && this.balance.customer_total) ? this.balance.customer_total : 0,
      'internalBalance': (this.balance && this.balance.customer_total) ? this.balance.customer_total : 0,
      'customerCurrency': this.customer.currency_id,
      'lifeTimeDeposit': (this.balance && this.balance.customer_life_time_deposit) ? this.balance.customer_life_time_deposit : 0,
      'lifeTimeTurnOvers': (this.balance && this.balance.customer_life_time_turnover) ? this.balance.customer_life_time_turnover : 0,
      'lifeTimeValue': (this.balance && this.balance.customer_life_time_value) ? this.balance.customer_life_time_value : 0,
      'customerID': this.customer.cid,
      'registrationDate': this.customer.created_at,
      'lastUpdated': this.customer.updated_at,
      'language': this.customer.lang_id,
      'city': this.customer.city,
      'state': this.customer.state ? this.customer.state : '',
      'isTest': this.customer.is_test,
      'persona': this.customer.persona_type_id,
      'kycStatus': this.customer.kyc_status_id,
      'loyaltyLevel': this.customer.loyalty_level ? this.customer.loyalty_level : '',
      'customerStatus': this.customer.status_id,
      'gender': this.customer.gender ? this.customer.gender : '',
      'numPreviousOrders': (this.customerStats && this.customerStats.num_previous_orders) ? this.customerStats.num_previous_orders : '',
      'lotteryBrands': (this.customerStats && this.customerStats.lotteries_played) ? this.customerStats.lotteries_played : '',
      'lastOrderDate': (this.customerStats && this.customerStats.last_order_date) ? this.customerStats.last_order_date : '',
      'loginStatus': 'logged In',
      'pageRealURL': pageFullUrl,
      'pageType': this.determinePageType(url),
      'siteBrand': this.brandId,
      'event': 'GTM page To GA'
    });
  }

  private determinePageType(url: string) {
    const slugsList: Array<string> = Object.keys(this.slugsMap).map((key: string) => this.slugsMap[key]);
    let pageType = '';
    if (url === '/') {
      pageType = 'Home page';
    } else if (url === '/cart') {
      pageType = 'Checkout-cart';
    } else if (url === '/myaccount/deposit') {
      pageType = 'Checkout-payment // Deposit';
    } else if (url.startsWith('/lotteries')) {
      pageType = 'Lotteries page';
    } else if (url.includes('/lotteries/results')) {
      pageType = 'Results page';
    } else if (url.startsWith('/myaccount')) {
      pageType = 'My account';
    } else if (url.startsWith('/signup')) {
      pageType = 'Checkout-registration';
    } else if (slugsList.indexOf(url.substring(1)) >= 0) {
      pageType = 'Lottery ticket page';
    } else {
      pageType = 'General Info';
    }
    return pageType;
  }

  // Registration
  trackOpenRegistration(label: string, checkoutObj?: {
    lotteriesMap: LotteriesMapInterface,
    upcomingDrawsMap: DrawsMapInterface,
    cartItems: Array<CartItemModel>
  }): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Registration',
      'GA_event_action': 'registration form presented',
      'GA_event_label': `${label}`,
      'event': 'GTM event To GA'
    });
    if (label === 'checkout') {
      const products = [];

      // TODO: add support for combos
      checkoutObj.cartItems
        .filter((item: CartItemModel) => item.type === 'lottery')
        .forEach((item: CartLotteryItemModel) => {
          products.push({
            'name': checkoutObj['lotteriesMap'][item.lotteryId].name + ' line',
            'id': item.lotteryId,
            'price': OfferingsService.findLotteryLinePrice(
              this.offeringsPrices,
              item.lotteryId,
              checkoutObj['upcomingDrawsMap'][item.lotteryId].id
            ),
            'brand': 'Biglotteryowin',
            'category': checkoutObj['lotteriesMap'][item.lotteryId].country_id,
            'variant': item.renewPeriod,
            'quantity': item.lines.length
          });
        });

      dataLayer.push({
        'event': 'checkout',
        'ecommerce': {
          'checkout': {
            'actionField': {'step': 1},
            'products': products
          }
        }
      });
    }
  }

  trackRegistrationFieldFilled(field: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Registration',
      'GA_event_action': `Registration - ${field}`,
      'GA_event_label': field,
      'event': 'GTM event To GA'
    });
  }

  trackRegistrationFieldError(field: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Registration',
      'GA_event_action': `Registration - ${field}`,
      'GA_event_label': 'field error',
      'event': 'GTM event To GA'
    });
  }

  trackRegistrationSubmitButtonClicked(label: string, status: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Registration',
      'GA_event_action': 'Registration - submit clicked',
      'GA_event_label': `${label} - ${status}`,
      'event': 'GTM event To GA'
    });
  }

  trackRegistrationSuccess(label: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Registration',
      'GA_event_action': 'Registration - success',
      'GA_event_label': label,
      'event': 'GTM event To GA'
    });
  }

  // Log in
  trackOpenLogin(label: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Log in',
      'GA_event_action': 'log in form presented',
      'GA_event_label': `${label}`,
      'event': 'GTM event To GA'
    });
  }

  trackLoginSuccess(label: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Log in',
      'GA_event_action': 'log in success',
      'GA_event_label': `${label}`,
      'event': 'GTM event To GA'
    });
  }

  trackOpenRecoveryForm(label: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Log in',
      'GA_event_action': 'recovery form presented',
      'GA_event_label': `${label}`,
      'event': 'GTM event To GA'
    });
  }

  trackRecoverySubmitted(label: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Log in',
      'GA_event_action': 'recovery submitted',
      'GA_event_label': `${label}`,
      'event': 'GTM event To GA'
    });
  }

  // Transactions
  trackDepositFormPresented(label: string, checkoutObj?: {
    lotteriesMap: LotteriesMapInterface,
    upcomingDrawsMap: DrawsMapInterface,
    cartItems: Array<CartItemModel>
  }): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Transactions',
      'GA_event_action': 'deposit form presented',
      'GA_event_label': `${label}`,
      'event': 'GTM event To GA'
    });

    if (label === 'checkout') {
      const products = [];

      // TODO: add support for combos
      checkoutObj.cartItems
        .filter((item: CartItemModel) => item.type === 'lottery')
        .forEach((item: CartLotteryItemModel) => {
          products.push({
            'name': checkoutObj['lotteriesMap'][item.lotteryId].name + ' line',
            'id': item.lotteryId,
            'price': OfferingsService.findLotteryLinePrice(
              this.offeringsPrices,
              item.lotteryId,
              checkoutObj['upcomingDrawsMap'][item.lotteryId].id
            ),
            'brand': 'Biglotteryowin',
            'category': checkoutObj['lotteriesMap'][item.lotteryId].country_id,
            'variant': item.renewPeriod,
            'quantity': item.lines.length
          });
        });

      dataLayer.push({
        'event': 'checkout',
        'ecommerce': {
          'checkout': {
            'actionField': {'step': 2},
            'products': products
          }
        }
      });
    }
  }

  trackDepositFieldClicked(fieldName): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Transactions',
      'GA_event_action': 'deposit ' + `${fieldName}`,
      'GA_event_label': 'fiiiled',
      'event': 'GTM event To GA'
    });
  }

  trackDepositFieldError(fieldName): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Transactions',
      'GA_event_action': 'deposit ' + `${fieldName}`,
      'GA_event_label': 'field error - try ' + `${AnalyticsDeprecatedService.depositErrorCount++}`,
      'event': 'GTM event To GA'
    });
  }

  trackFirstPurchase(label: string) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const purchaseCount = this.walletService.getCurrentPurchaseTransactionCount();

    dataLayer.push({
      'GA_event_category': 'Transactions',
      'GA_event_action': 'Purchase - Purchase Count',
      'GA_event_label': `${purchaseCount + 1}`,
      'event': 'GTM event To GA'
    });
  }

  trackOrderSuccess(checkoutObj?: {
    lotteriesMap: LotteriesMapInterface,
    upcomingDrawsMap: DrawsMapInterface,
    cartItems: Array<CartItemModel>
  }): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const count = this.walletService.getCurrentDepositTransactionCount() + 1;
    const order: OrderInterface = this.walletService.getCurrentOrderObj();
    const orderItems = JSON.parse(order.items_json);
    this.trackSubscriptionsPurchases(orderItems.subscriptions);
    this.trackCombosPurchases(orderItems.combos);
    this.trackBundlesPurchases(orderItems.bundles);
    dataLayer.push({
      'GA_event_category': 'Transactions',
      'GA_event_action': 'order success',
      'GA_event_label': `${order.customer_total_amount}`,
      'GA_event_sub_label': `${count}`,
      'event': 'GTM event To GA'
    });

    const products = [];

    // TODO: add support for combos
    checkoutObj.cartItems
      .filter((item: CartItemModel) => item.type === 'lottery')
      .forEach((item: CartLotteryItemModel) => {
        products.push({
          'name': checkoutObj['lotteriesMap'][item.lotteryId].name + ' line',
          'id': item.lotteryId,
          'price': OfferingsService.findLotteryLinePrice(
            this.offeringsPrices,
            item.lotteryId,
            checkoutObj['upcomingDrawsMap'][item.lotteryId].id
          ),
          'brand': 'Biglotteryowin',
          'category': checkoutObj['lotteriesMap'][item.lotteryId].country_id,
          'variant': item.renewPeriod,
          'quantity': item.lines.length
        });
      });


    // Timeout for executing after tracking page change
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.zone.run(() => {
          dataLayer.push({
            'event': 'eecPurchase',
            'name': checkoutObj.cartItems
              .filter((item: CartItemModel) => item.type === 'lottery')
              .map((item: CartLotteryItemModel) => item.lotteryId)
              .toString(),
            'lotteryBrands': (this.customerStats && this.customerStats.lotteries_played) ? this.customerStats.lotteries_played : '',
            'ecommerce': {
              'purchase': {
                'actionField': {
                  'id': order.id,
                  'revenue': `${order.customer_total_amount}`
                  // 'Tax':'[tax]',
                  // 'coupon': '[if available]'
                },
                'products': products
              }
            }
          });
        });
      }, 800);
    });
  }

  trackSubscriptionsPurchases(subscriptions): void {
    if (!isPlatformBrowser(this.platformId) || subscriptions.length === 0) {
      return;
    }

    let amount = 0;
    subscriptions.map(item => amount += item.customer_amount);
    dataLayer.push({
      'GA_event_category': 'Transactions',
      'GA_event_action': 'Purchase - Subscription',
      'GA_event_label': `${amount}`,
      'event': 'GTM event To GA'
    });
  }

  trackCombosPurchases(combos): void {
    if (!isPlatformBrowser(this.platformId) || combos.length === 0) {
      return;
    }

    let amount = 0;
    combos.map(item => amount += item.customer_amount);
    dataLayer.push({
      'GA_event_category': 'Transactions',
      'GA_event_action': 'Purchase - Combo',
      'GA_event_label': `${amount}`,
      'event': 'GTM event To GA'
    });
  }

  trackBundlesPurchases(bundles): void {
    if (!isPlatformBrowser(this.platformId) || bundles.length === 0) {
      return;
    }

    let amount = 0;
    bundles.map(item => amount += item.customer_amount);
    dataLayer.push({
      'GA_event_category': 'Transactions',
      'GA_event_action': 'Purchase - Bundle',
      'GA_event_label': `${amount}`,
      'event': 'GTM event To GA'
    });
  }

  trackWithdrawSubmit(amount: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Transactions',
      'GA_event_action': 'withdraw submit',
      'GA_event_label': `${amount}`,
      'currency': this.siteCurrencyId,
      'event': 'GTM event To GA'
    });
  }

  trackCarouselSpin(direction: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Product Promotions',
      'GA_event_action': 'Carousel-Spin',
      'GA_event_label': `Homepage carousel list - ${direction}`,
      'event': 'GTM event To GA'
    });
  }

  trackCarouselListClicked(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Product Promotions',
      'GA_event_action': 'See All Lotteries',
      'GA_event_label': 'Homepage carousel list',
      'event': 'GTM event To GA'
    });
  }

  trackResentWinnigNumberClicked(label: string, lotteryName: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Resultes',
      'GA_event_action': 'Check Results - Clicked',
      'GA_event_label': `Recent Winning Lottery Numbers - ${label} - ${lotteryName}`,
      'event': 'GTM event To GA'
    });
  }

  trackResultsCheckerClicked(lotteryName: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Resultes',
      'GA_event_action': 'Check Results - Clicked',
      'GA_event_label': `Lottery Results Checker - Check My Numbers - ${lotteryName}`,
      'event': 'GTM event To GA'
    });
  }

  trackAllResultsLinkClicked(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Resultes',
      'GA_event_action': 'See All Results - Clicked',
      'GA_event_label': 'See All Results - Homepage',
      'event': 'GTM event To GA'
    });
  }

  trackExploreAllLotteriesClicked(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Product Promotions',
      'GA_event_action': 'Explore All Lotteries - Clicked',
      'GA_event_label': 'Homepage bottom list',
      'event': 'GTM event To GA'
    });
  }

  trackFooterClicked(label: string, linkText: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Footer',
      'GA_event_action': 'Footer - Clicked',
      'GA_event_label': `Footer - Clicked - ${label} - ${linkText}`,
      'event': 'GTM event To GA'
    });
  }

  trackFooterWinButtonClicked(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Footer',
      'GA_event_action': 'Footer - Clicked',
      'GA_event_label': 'Footer - Clicked - Join and Win',
      'event': 'GTM event To GA'
    });
  }

  trackSocialIconClicked(socialIcon: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Footer',
      'GA_event_action': 'Footer - Clicked',
      'GA_event_label': `Footer - Clicked - Social - ${socialIcon}`,
      'event': 'GTM event To GA'
    });
  }

  trackFindAddressClicked(status: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Registration',
      'GA_event_action': 'Registration - Find address clicked',
      'GA_event_label': `${status}`,
      'event': 'GTM event To GA'
    });
  }

  trackEnterAddressManually(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Registration',
      'GA_event_action': 'Registration - Enter address manually',
      'GA_event_label': 'Enter address manually',
      'event': 'GTM event To GA'
    });
  }

  trackAlreadyMemberClicked(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Registration',
      'GA_event_action': 'Registration - Already a member - Clicked',
      'GA_event_label': 'Already a member',
      'event': 'GTM event To GA'
    });
  }

  trackLogInClicked(label: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Log in',
      'GA_event_action': 'Log in - Clicked',
      'GA_event_label': `${label}`,
      'event': 'GTM event To GA'
    });
  }

  trackTrashIconClicked(icon: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Cart interactions',
      'GA_event_action': `cart interactions - delete ${icon} clicked`,
      'GA_event_label': `cart interactions - delete ${icon}`,
      'event': 'GTM event To GA'
    });
  }

  trackCartInteractionClick(label: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Cart interactions',
      'GA_event_action': `cart interactions - ${label} clicked`,
      'GA_event_label': `cart interactions - ${label}`,
      'event': 'GTM event To GA'
    });
  }

  trackLotteriesSortClicked(option: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Lotteries interactions',
      'GA_event_action': 'Lotteries interactions - sort by',
      'GA_event_label': `sort by - ${option}`,
      'event': 'GTM event To GA'
    });
  }

  trackSeeAllResultsClicked(lotteryName: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Resultes',
      'GA_event_action': 'See All Results - Clicked',
      'GA_event_label': `See All Results - Results Page - ${lotteryName}`,
      'event': 'GTM event To GA'
    });
  }

  trackResultPlayNowClicked(lotteryName: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Product promotions',
      'GA_event_action': 'Play now - clicked',
      'GA_event_label': `Lottery result page - ${lotteryName}`,
      'event': 'GTM event To GA'
    });
  }

  trackAccountMenuClicked(option: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'My Account',
      'GA_event_action': 'My Account - Clicked',
      'GA_event_label': `My Account - Clicked - ${option}`,
      'event': 'GTM event To GA'
    });
  }

  trackCartInteractions(label: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Cart interactions',
      'GA_event_action': `Cart interactions - ${label}`,
      'GA_event_label': `Cart interactions - ${label}`,
      'event': 'GTM event To GA'
    });
  }

  trackPhoneNumberClicking(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Phone',
      'GA_event_action': 'Phone number-Clicked',
      'GA_event_label': 'phone',
      'event': 'GTM event To GA'
    });
  }

  trackChatClicking(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Chat',
      'GA_event_action': 'Chat-Clicked',
      'GA_event_label': 'chat',
      'event': 'GTM event To GA'
    });
  }

  trackCloseRegistration(label) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Registration',
      'GA_event_action': 'Registration - Closed Form',
      'GA_event_label': `${label}`,
      'event': 'GTM event To GA'
    });
  }

  trackClosingBrowserInCart() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Cart interactions',
      'GA_event_action': 'Cart interactions - Closing Browser',
      'GA_event_label': 'Closing browser',
      'event': 'GTM event To GA'
    });
  }

  trackClickBackButtonInCart() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Cart interactions',
      'GA_event_action': 'Cart interactions - Clicking Back',
      'GA_event_label': 'Clicking Back',
      'event': 'GTM event To GA'
    });
  }

  trackScrollCart(label) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Homepage',
      'GA_event_action': 'Homepage - Scroll',
      'GA_event_label': `${label}`,
      'event': 'GTM event To GA'
    });
  }

  trackAddLotteryToCart() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Cart interactions',
      'GA_event_action': 'cart interactions - add a lottery clicked',
      'GA_event_label': 'cart interactions - add a lottery',
      'event': 'GTM event To GA'
    });
  }

  trackTicketPickDoneClicked() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Lottery ticket interactions',
      'GA_event_action': 'ticket interactions - Done - clicked',
      'GA_event_label': 'mobile only',
      'event': 'GTM event To GA'
    });
  }

  // Lucky numbers
  trackLuckyNumbersEditClicked(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'My Account - My Lucky Numbers - Clicked',
      'GA_event_action': 'My Account - My Lucky Numbers - Edit Button - Clicked',
      'GA_event_label': 'My Account - My Lucky Numbers - Edit Button - Clicked',
      'event': 'GTM event To GA'
    });
  }

  trackNewLuckyNumber(value: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'My Account - My Lucky Numbers - Edit Line',
      'GA_event_action': `My Account - My Lucky Numbers - Edit Line - ${value}`,
      'GA_event_label': `My Account - My Lucky Numbers - Edit Line - ${value}`,
      'event': 'GTM event To GA'
    });
  }

  trackLuckyNumberDeleteLine(lineOrder: number): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'My Account - My Lucky Numbers - Edit Line',
      'GA_event_action': 'My Account - My Lucky Numbers - Delete Line',
      'GA_event_label': `My Account - My Lucky Numbers - Delete Line - ${lineOrder}`,
      'event': 'GTM event To GA'
    });
  }

  trackLuckyNumbersAddLine(countClicks: number): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'My Account - My Lucky Numbers - Edit Line',
      'GA_event_action': 'My Account - My Lucky Numbers - Add Line',
      'GA_event_label': `My Account - My Lucky Numbers - Add Line - ${countClicks}`,
      'event': 'GTM event To GA'
    });
  }

  trackLuckyNumbersSaveLine(countLines: number): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'My Account - My Lucky Numbers - Edit Line',
      'GA_event_action': 'My Account - My Lucky Numbers - Save Line',
      'GA_event_label': `My Account - My Lucky Numbers - Save Line - ${countLines}`,
      'event': 'GTM event To GA'
    });
  }

  trackSaveLuckyNumbers(countClicks: number): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    dataLayer.push({
      'GA_event_category': 'Lottery ticket interactions',
      'GA_event_action': 'ticket interactions - save as lucky numbers - clicked',
      'GA_event_label': `ticket interactions - save as lucky numbers - ${countClicks}`,
      'event': 'GTM event To GA'
    });
  }

  trackMyLuckyNumbersBtnClicked(countLines: number): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    dataLayer.push({
      'GA_event_category': 'Lottery ticket interactions',
      'GA_event_action': 'ticket interactions - my lucky numbers - clicked',
      'GA_event_label': `ticket interactions - my lucky numbers - ${countLines}`,
      'event': 'GTM event To GA'
    });
  }

}
