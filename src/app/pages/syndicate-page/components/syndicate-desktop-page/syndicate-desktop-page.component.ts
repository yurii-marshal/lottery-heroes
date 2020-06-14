import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';

import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';

import {
  LotteryInfoCmsBasedContainerComponent
} from '../../../../modules/lottery-info-cms-based/lottery-info-cms-based.container.component';

@Component({
  selector: 'app-syndicate-desktop-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './syndicate-desktop-page.component.html',
  styleUrls: ['./syndicate-desktop-page.component.scss']
})
export class SyndicateDesktopPageComponent {
  @Input() syndicateModel: SyndicateModel;

  @ViewChild('infoCms') infoCms: LotteryInfoCmsBasedContainerComponent;
}
