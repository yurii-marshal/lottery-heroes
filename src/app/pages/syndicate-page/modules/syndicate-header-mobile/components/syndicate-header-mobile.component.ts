import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';

@Component({
  selector: 'app-syndicate-header-mobile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './syndicate-header-mobile.component.html',
  styleUrls: ['./syndicate-header-mobile.component.scss']
})
export class SyndicateHeaderMobileComponent {
  @Input() syndicateModel: SyndicateModel;
}
