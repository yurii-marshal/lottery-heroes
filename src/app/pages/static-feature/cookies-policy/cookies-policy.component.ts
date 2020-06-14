import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MetaService } from '../../../modules/meta/services/meta.service';
import { BrandParamsService } from '../../../modules/brand/services/brand-params.service';

@Component({
  selector: 'app-cookies-policy',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cookies-policy.component.html',
  styleUrls: ['./cookies-policy.component.scss']
})
export class CookiesPolicyComponent implements OnInit {
  supportEmail: string;

  constructor(private metaService: MetaService,
              private brandParamsService: BrandParamsService) { }

  ngOnInit(): void {
    this.metaService.setFromConfig('page', 'cookies');
    this.brandParamsService.getConfig('supportEmail')
      .subscribe(configValue => this.supportEmail = configValue);
  }
}
