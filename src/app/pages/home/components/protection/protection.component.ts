import { Component, OnInit } from '@angular/core';
import { BrandParamsService } from '../../../../modules/brand/services/brand-params.service';

@Component({
  selector: 'app-protection',
  templateUrl: './protection.component.html',
  styleUrls: ['./protection.component.scss']
})
export class ProtectionComponent implements OnInit {
  // BrandParams
  protectionIcon: {[key: string]: boolean};
  brandId: string;

  constructor(private brandParamsService: BrandParamsService) {
    this.brandId = this.brandParamsService.getBrandId();
  }

  ngOnInit() {
    this.brandParamsService.getConfig('protectionIcon')
      .subscribe(configValue => this.protectionIcon = configValue);
  }
}
