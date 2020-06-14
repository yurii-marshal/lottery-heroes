import { InjectionToken } from '@angular/core';

export const BrandsConfig = new InjectionToken('BrandsConfig');
export const brandsConfig = {
  BIGLOTTERYOWIN_COM: {
    common: {
      langId: 'en'
    },
    schema: {
      name: 'Biglotteryowin',
      alternateName: 'BigLotteryOWin',
      // tslint:disable-next-line:max-line-length
      description: 'Play the biggest lottery jackpots from around the world with BigLotteryOWin! Winning the lottery was always a dream? With one small step it can be your reality!',
      logo: '/assets/images/header/biglottery_logo.svg',
      telephone: '+44 xxx xxxx xxx',
      areaServed: ''
    },
    dateFormat: {
      shortDateFormat: 'dd-MM-yyyy'
    },
    brandPaymentLimited: false,
    minimumDeposit: 2,
    paymentSystem: {
      development: {
        mode: 'apcopay',
        is_active: 1
      },
      production: {
        mode: 'apcopay',
        is_active: 1
      },
      staging: {
        mode: 'apcopay',
        is_active: 1
      },
      testing: {
        mode: 'apcopay',
        is_active: 1
      },
      local: {
        mode: 'apcopay',
        is_active: 1
      }
    },
    header: {
      lotteryIds: [
        'euromillions-ie',
        'lotto-uk',
        'lotto-fr',
      ],
      showBetVsPlay: false,
      showSupportPhone: false,
      lotteryIdsLotteryDropDown: [
        'euromillions-ie',
        'lotto-ie',
        'megamillions',
      ],
      lotteryIdsResultsDropDown: [
        'euromillions-ie',
        'lotto-ie',
        'megamillions',
      ],
    },
    footer: {
      showIcons: {
        eighteenPlus: true,
        norton: true,
        gambleaware: 'gambleaware',
        gambleawareUrl: 'http://www.begambleaware.org/',
        gamcare: false,
        gamblersanonymous: false,
        responsiblegambling: false,
        gamblingcommission: false,
      },
      manageSocialIcons: {
        facebook: true,
        twitter: true,
        linkedin: true,
        facebookUrl: 'https://www.facebook.com/BIGLOTTERYOWIN/',
        twitterUrl: 'https://twitter.com/BIGLOTTERYOWIN',
      },
      lotteryIds: [
        'euromillions-ie',
        'powerball',
        'lotto-uk',
        'eurojackpot',
      ],
      showBetVsPlay: false,
    },
    hotjarId: '1087197',
    drawResults: {
      funFacts: true,
      description: false,
    },
    supportEmail: 'support@biglotteryowin.com',
    windowLiveChatId: 'xxxx',
    liveChatUniqueToken: 'xxxx',
    isShowChat: true,
    protectionIcon: {
      protectionIconCOM: true
    },
    metaLink: {
      isActive: true,
      links: [
        {rel: 'alternate', hreflang: 'x-default'}
      ]
    },
    passwordValidator: {
      minLength: 8,
      strongValidation: true,
    },
    aboutPageMenu: {
      showMenuItem: {
        safeAndSecure: false
      }
    },
    followUsModule: {
      facebookUrl: 'https://www.facebook.com/BIGLOTTERYOWIN/',
    },
    accountUnverified: true
  },
  accountUnverified: false
};
