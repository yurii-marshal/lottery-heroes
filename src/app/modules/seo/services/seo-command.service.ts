import { Inject, Injectable } from '@angular/core';


import { MetaLinkService } from './meta-link.service';
import { BrandParamsService } from '../../../modules/brand/services/brand-params.service';
import { getAllBrands } from 'package-brands';
import { EnvironmentService } from '../../../services/environment/environment.service';
import { PAGE_EXCLUSIONS_CONFIG } from '../configs/page-exclusions.conf';

declare const dataLayer: Array<any>;

@Injectable()
export class SeoCommandService {

  constructor(private metaLinkService: MetaLinkService,
              private brandParamsService: BrandParamsService,
              private environmentService: EnvironmentService,
              @Inject(PAGE_EXCLUSIONS_CONFIG) private pageExclusionsConfig) {
  }

  setCanonical(url: string): void {
    this.metaLinkService.removeTag('canonical');

    const href = this.brandParamsService.getURL() + url;
    this.setMetaLink(href, 'canonical');
  }

  setHrefLang(url: string): void {
    this.metaLinkService.removeTag('alternate');

    const brandsParams = getAllBrands(this.environmentService.getEnvironmentData('environment'));
    const brands = Object.keys(brandsParams).filter(key => !key.indexOf('BIGLOTTERYOWIN'));

    let hostname: string;
    let lang: string;

    brands
      .filter(brand => this.pageExclusionsConfig[brand].slugExclusions
        .filter(regExp => url.search(regExp) !== -1).length === 0)
      .forEach((element) => {

        hostname = brandsParams[element]['protocol'] +
          '://' + brandsParams[element]['hostname'] + url;

        lang = brandsParams[element]['locales'][0];
        lang = lang === 'en' ? 'x-default' : lang;

        this.setMetaLink(hostname, 'alternate', lang);
      });
  }

  private setMetaLink(url: string, rel: string, lang?: string) {

    const queryParamStartIndex = url.indexOf('?');
    if (queryParamStartIndex !== -1) {
      url = url.slice(0, queryParamStartIndex);
    }

    const tag = {};

    tag['rel'] = rel;
    tag['href'] = url;

    if (typeof lang !== 'undefined') {
      tag['hreflang'] = lang;
    }

    this.metaLinkService.addTag(tag);
  }
}
