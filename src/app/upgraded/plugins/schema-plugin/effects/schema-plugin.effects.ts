import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter, first, switchMap, tap } from 'rxjs/operators';

import { ScripterCommandService } from '@libs/scripter/services/commands/scripter-command.service';
import { RequestQueryService } from '@libs/environment/services/queries/request-query.service';
import { BrandQueryService } from '@libs/biglotteryowin-core/services/queries/brand-query.service';
import { LotteriesQueryService } from '@libs/biglotteryowin-core/services/queries/lotteries-query.service';

import { APP_CONFIG } from '../../../configs/app.config';
import { SCHEMA_PLUGIN_CONFIG } from '../configs/schema-plugin.config';
import { RouterStateUrl } from '@libs/router-store/reducers';

import { LotteryModel } from '@libs/biglotteryowin-core/models/lottery.model';
import { DatesUtil } from '../../../../modules/shared/utils/dates.util';
import { DrawsQueryService } from '@libs/biglotteryowin-core/services/queries/draws-query.service';
import { DrawModel } from '@libs/biglotteryowin-core/models/draw.model';

@Injectable()
export class SchemaPluginEffects {
  private domainUrl: string;
  private config: {[key: string]: any};
  private appConfig: {[key: string]: any};

  constructor(private actions$: Actions,
              private scripterCommandService: ScripterCommandService,
              private lotteriesQueryService: LotteriesQueryService,
              private drawsQueryService: DrawsQueryService,
              requestQueryService: RequestQueryService,
              brandQueryService: BrandQueryService,
              @Inject(SCHEMA_PLUGIN_CONFIG) schemaPluginConfig: {[brandId: string]: object},
              @Inject(APP_CONFIG) appConfig: {[brandId: string]: object}) {
    this.domainUrl = requestQueryService.getLocationOrigin();

    const brandId = brandQueryService.getBrandId();
    this.config = schemaPluginConfig[brandId];
    this.appConfig = appConfig[brandId];
  }

  /********************************
   SITE INFO
   ********************************/

  @Effect({dispatch: false})
  websiteInfo$ = this.actions$
    .ofType(ROUTER_NAVIGATION)
    .pipe(
      first(),
      tap(() => {
        const block = {
          '@type': 'Corporation',
          name: this.config['name'],
          url: this.domainUrl,
          logo: `${this.domainUrl}${this.config['logo']}`,
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: this.config['telephone'],
            contactType: 'customer support',
            areaServed: this.config['areaServed']
          },
          sameAs: [
            this.appConfig['twitterUrl'],
            this.appConfig['facebookUrl']
          ]
        };

        const schema = {
          '@context': 'http://schema.org',
          '@type': 'WebSite',
          name: this.config['name'],
          alternateName: this.config['alternateName'],
          description: this.config['description'],
          url: this.domainUrl,
          image: `${this.domainUrl}${this.config['logo']}`,
          sameAs: [
            this.appConfig['twitterUrl'],
            this.appConfig['facebookUrl']
          ],
          copyrightHolder: block,
          author: block,
          creator: block,
        };

        this.scripterCommandService
          .addScript('website-info-schema', schema, 'body', 'application/ld+json');
      })
    );

  /********************************
   HOME INFO
   ********************************/

  @Effect({dispatch: false})
  homeInfo$ = this.actions$
    .ofType(ROUTER_NAVIGATION)
    .pipe(
      tap((router: RouterNavigationAction<RouterStateUrl>) =>
        this.scripterCommandService.removeScript('home-info-schema')),
      filter((router: RouterNavigationAction<RouterStateUrl>) =>
        router.payload.routerState.urlWithoutQueryParams === '/'),
      tap(() => {
        const schema = {
          '@context': 'http://schema.org',
          '@type': 'Corporation',
          name: this.config['name'],
          url: this.domainUrl,
          logo: `${this.domainUrl}${this.config['logo']}`,
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: this.config['telephone'],
            contactType: 'customer support',
            areaServed: this.config['areaServed']
          },
          sameAs: [
            this.appConfig['twitterUrl'],
            this.appConfig['facebookUrl']
          ]
        };

        this.scripterCommandService
          .addScript('home-info-schema', schema, 'body', 'application/ld+json');
      })
    );

  /********************************
   LOTTERIES
   ********************************/

  @Effect({dispatch: false})
  lotteries$ = this.actions$
    .ofType(ROUTER_NAVIGATION)
    .pipe(
      tap((router: RouterNavigationAction<RouterStateUrl>) =>
        this.scripterCommandService.removeScript('lotteries-schema')),
      filter((router: RouterNavigationAction<RouterStateUrl>) =>
        router.payload.routerState.urlWithoutQueryParams === '/lotteries'),
      tap(() => {
        const schema = {
          '@context': 'http://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [{
            '@type': 'ListItem',
            position: 1,
            item: {
              '@id': `${this.domainUrl}/lotteries`,
              name: 'Lotteries'
            }
          }]
        };

        this.scripterCommandService
          .addScript('lotteries-schema', schema, 'body', 'application/ld+json');
      })
    );

  /********************************
   LOTTERY TICKETS
   ********************************/

  @Effect({dispatch: false})
  lotteryTickets$ = this.actions$
    .ofType(ROUTER_NAVIGATION)
    .pipe(
      tap((router: RouterNavigationAction<RouterStateUrl>) =>
        this.scripterCommandService.removeScript('lottery-tickets-schema')),
      filter((router: RouterNavigationAction<RouterStateUrl>) =>
        router.payload.routerState.data.pageType === 'lottery'),
      switchMap((router: RouterNavigationAction<RouterStateUrl>) =>
        this.lotteriesQueryService.getLotteryModelById(router.payload.routerState.data.lotteryId)
      ),
      filter((lottery: LotteryModel | undefined) => typeof lottery !== 'undefined'),
      tap((lottery: LotteryModel) => {
        const schema = {
          '@context': 'http://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              item: {
                '@id': `${this.domainUrl}/lotteries`,
                name: 'Lotteries'
              }
            },
            {
              '@type': 'ListItem',
              position: 2,
              item: {
                '@id': `${this.domainUrl}/${lottery.slug}`,
                name: `${lottery.name}`,
                image: `${lottery.logo}`
              }
            }
          ]
        };

        this.scripterCommandService
          .addScript('lottery-tickets-schema', schema, 'body', 'application/ld+json');
      })
    );

  /********************************
   RESULTS
   ********************************/

  @Effect({dispatch: false})
  lotteriesResults$ = this.actions$
    .ofType(ROUTER_NAVIGATION)
    .pipe(
      tap((router: RouterNavigationAction<RouterStateUrl>) =>
        this.scripterCommandService.removeScript('lottery-results-schema')),
      filter((router: RouterNavigationAction<RouterStateUrl>) =>
        router.payload.routerState.urlWithoutQueryParams === '/lotteries/results'),
      tap(() => {
        const schema = {
          '@context': 'http://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [{
            '@type': 'ListItem',
            position: 1,
            item: {
              '@id': `${this.domainUrl}/lotteries/results`,
              name: 'Results'
            }
          }]
        };
        this.scripterCommandService
          .addScript('lottery-results-schema', schema, 'body', 'application/ld+json');
      })
    );

  /********************************
   RESULTS PER LOTTERY
   ********************************/

  @Effect({dispatch: false})
  resultsPerLottery$ = this.actions$
    .ofType(ROUTER_NAVIGATION)
    .pipe(
      tap((router: RouterNavigationAction<RouterStateUrl>) =>
        this.scripterCommandService.removeScript('results-per-lottery-schema')),
      filter((router: RouterNavigationAction<RouterStateUrl>) =>
        router.payload.routerState.data.pageType === 'result-lottery'),
      switchMap((router: RouterNavigationAction<RouterStateUrl>) =>
        this.lotteriesQueryService.getLotteryModelById(router.payload.routerState.data.lotteryId)
      ),
      filter((lottery: LotteryModel | undefined) => typeof lottery !== 'undefined'),
      tap((lottery: LotteryModel) => {
        const schema = {
          '@context': 'http://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              item: {
                '@id': `${this.domainUrl}/lotteries/results`,
                name: 'Results'
              }
            },
            {
              '@type': 'ListItem',
              position: 2,
              item: {
                '@id': `${this.domainUrl}/${lottery.slug}/results`,
                name: `${lottery.name} Results`,
                image: `${lottery.logo}`
              }
            }
          ]
        };

        this.scripterCommandService
          .addScript('results-per-lottery-schema', schema, 'body', 'application/ld+json');
      })
    );

  /********************************
   RESULTS PER DRAW
   ********************************/

  @Effect({dispatch: false})
  resultsPerDraw$ = this.actions$
    .ofType(ROUTER_NAVIGATION)
    .pipe(
      tap((router: RouterNavigationAction<RouterStateUrl>) =>
        this.scripterCommandService.removeScript('results-per-draw-schema')),
      filter((router: RouterNavigationAction<RouterStateUrl>) =>
        router.payload.routerState.data.pageType === 'result-draw'),
      switchMap((router: RouterNavigationAction<RouterStateUrl>) =>
        combineLatest(
          this.lotteriesQueryService
            .getLotteryModelById(router.payload.routerState.data.lotteryId),
          this.drawsQueryService
            .getDrawByDateLocal(router.payload.routerState.data.lotteryId, router.payload.routerState.params.dateLocal)
        )
      ),
      filter(([lottery, drawModel]: [LotteryModel | undefined, DrawModel]) => typeof lottery !== 'undefined'),
      tap(([lottery, drawModel]: [LotteryModel, DrawModel]) => {
        const schema = {
          '@context': 'http://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              item: {
                '@id': `${this.domainUrl}/lotteries/results`,
                name: 'Results'
              }
            },
            {
              '@type': 'ListItem',
              position: 2,
              item: {
                '@id': `${this.domainUrl}/${lottery.slug}/results`,
                name: `${lottery.name} Results`,
                image: `${lottery.logo}`
              }
            },
            {
              '@type': 'ListItem',
              position: 3,
              item: {
                '@id': `${this.domainUrl}/${lottery.slug}/results/${drawModel.dateLocal}`,
                name: `${DatesUtil.formatDate(new Date(drawModel.dateLocal))}`
              }
            }
          ]
        };

        this.scripterCommandService
          .addScript('results-per-draw-schema', schema, 'body', 'application/ld+json');
      })
    );
}
