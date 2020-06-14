import { Component, OnInit } from '@angular/core';
import { MetaService } from '../../../modules/meta/services/meta.service';
import { GlobalService } from '../../../services/global.service';
import { BrandParamsService } from '../../../modules/brand/services/brand-params.service';
import {WindowService} from '../../../services/device/window.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  supportEmail: string;
  isShowChat: boolean;

  constructor(private metaService: MetaService,
              private globalService: GlobalService,
              public winRef: WindowService,
              private brandParamsService: BrandParamsService) {
  }

  ngOnInit(): void {
    this.brandParamsService.getConfig('supportEmail')
      .subscribe(configValue => this.supportEmail = configValue);

    this.brandParamsService.getConfig('isShowChat').subscribe(configValue => this.isShowChat = configValue);

    this.metaService.setFromConfig('page', 'faq');
  }

  showSigninLightbox(): void {
    this.globalService.showLightbox$.emit({name: 'auth', value: 'signin'});
  }

  setHeight(e) {
    const item = e.target.parentElement;
    const input = item.children['0'];
    const itemWrapper = item.children['3'];
    const itemBody = item.children['3'].firstElementChild;

    if (input.checked) {
      itemWrapper.style.maxHeight = itemBody.offsetHeight + 'px';
    } else {
      itemWrapper.style.maxHeight = '0px';
    }
  }
}
