import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';

@Component({
  selector: 'app-syndicate-header-mobile-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-syndicate-header-mobile
      [syndicateModel]="syndicateModel"
    ></app-syndicate-header-mobile>
  `
})

export class SyndicateHeaderMobileContainerComponent {
  @Input() syndicateModel: SyndicateModel;
}
