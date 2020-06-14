import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CmsService } from '../cms/services/cms.service';

import { FaqCmsInterface } from './entities/faq-cms.interface';
import { LotteriesService } from '../../services/lotteries/lotteries.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-faq-cms-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-faq-cms
      *ngIf="cms$ | async"
      [cms]="cms$ | async"
    ></app-faq-cms>
  `,
})
export class FaqCmsContainerComponent implements OnInit {
  @Input() lotteryId: string;

  cms$: Observable<FaqCmsInterface>;

  constructor(private cmsService: CmsService,
              private lotteriesService: LotteriesService) {
  }

  ngOnInit(): void {
    this.cms$ = this.lotteriesService.getSlug(this.lotteryId)
      .pipe(
        switchMap((slug: string) => this.cmsService.getPageData(slug))
      );
  }
}
