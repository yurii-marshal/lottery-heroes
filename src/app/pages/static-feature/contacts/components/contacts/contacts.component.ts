import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MetaService } from '../../../../../modules/meta/services/meta.service';
import { BrandParamsService } from '../../../../../modules/brand/services/brand-params.service';

@Component({
  selector: 'app-contacts',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  supportEmail: string;
  manageSocialIcons: {[key: string]: boolean};

  constructor(private metaService: MetaService,
              private brandParamsService: BrandParamsService) { }

  ngOnInit(): void {
    this.metaService.setFromConfig('page', 'contact');
    this.brandParamsService.getConfig('supportEmail')
      .subscribe(configValue => this.supportEmail = configValue);

    this.brandParamsService.getConfig('footer', 'manageSocialIcons')
      .subscribe(configValue => this.manageSocialIcons = configValue);
  }
}
