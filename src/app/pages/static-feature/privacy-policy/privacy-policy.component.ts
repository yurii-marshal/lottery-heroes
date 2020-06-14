import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MetaService } from '../../../modules/meta/services/meta.service';
import { BrandParamsService } from '../../../modules/brand/services/brand-params.service';

@Component({
  selector: 'app-privacy-policy',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  supportEmail: string;

  constructor(private metaService: MetaService,
              private brandParamsService: BrandParamsService) { }

  ngOnInit(): void {
    this.metaService.setFromConfig('page', 'privacy');
    this.brandParamsService.getConfig('supportEmail')
      .subscribe(configValue => this.supportEmail = configValue);
  }
}
