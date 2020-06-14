import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../services/global.service';
import { BrandParamsService } from '../../../modules/brand/services/brand-params.service';

@Component({
  selector: 'app-lightbox-limited-status',
  templateUrl: './lightbox-limited-status.component.html',
  styleUrls: ['./lightbox-limited-status.component.scss']
})
export class LightboxLimitedStatusComponent implements OnInit {
  isShow = false;
  afterAuthLimitedMessage = false;
  supportEmail: string;

  constructor(private globalService: GlobalService,
              private brandParamsService: BrandParamsService) { }

  ngOnInit() {
    this.globalService.showLightbox$
      .filter(params => params['name'] === 'limited-status')
      .subscribe(
        params => {
          this.isShow = true;
          params['value'] === 'afterAuth' ? this.afterAuthLimitedMessage = true : this.afterAuthLimitedMessage = false;
        }
      );

    this.brandParamsService.getConfig('supportEmail')
      .subscribe(configValue => this.supportEmail = configValue);
  }

  closeLightbox() {
    this.isShow = false;
  }

}
