import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../../services/global.service';
import { BrandParamsService } from '../../../brand/services/brand-params.service';

@Component({
  selector: 'app-password-update-successfully',
  templateUrl: './password-update-successfully.component.html',
  styleUrls: ['./password-update-successfully.component.scss']
})
export class PasswordUpdateSuccessfullyComponent implements OnInit {
  // BrandParams
  isShowChat: boolean;

  isShow = false;

  constructor(private globalService: GlobalService,
              private brandParamsService: BrandParamsService) {
  }

  ngOnInit() {
    this.globalService.showLightbox$
      .filter(params => params['name'] === 'password-update-successfully')
      .subscribe(() => this.isShow = true);

    this.brandParamsService.getConfig('isShowChat').subscribe(configValue => this.isShowChat = configValue);
  }

  onCloseLightbox() {
    this.isShow = false;
  }
}
