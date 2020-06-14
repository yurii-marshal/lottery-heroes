import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';

import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';

import {
  LotteryInfoCmsBasedContainerComponent
} from '../../../../modules/lottery-info-cms-based/lottery-info-cms-based.container.component';

@Component({
  selector: 'app-syndicate-mobile-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './syndicate-mobile-page.component.html',
  styleUrls: ['./syndicate-mobile-page.component.scss']
})
export class SyndicateMobilePageComponent {
  @Input() syndicateModel: SyndicateModel;

  @ViewChild('infoCms') infoCms: LotteryInfoCmsBasedContainerComponent;
}
