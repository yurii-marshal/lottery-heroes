import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {MetaService} from '../../../modules/meta/services/meta.service';
import {BrandParamsService} from '../../../modules/brand/services/brand-params.service';

@Component({
  selector: 'app-terms-and-conditions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {
  supportEmail: string;

  constructor(private metaService: MetaService,
              private brandParamsService: BrandParamsService) {
  }

  ngOnInit(): void {
    this.metaService.setFromConfig('page', 'terms-and-conditions');
    this.brandParamsService.getConfig('supportEmail')
      .subscribe(configValue => this.supportEmail = configValue);
  }
}
