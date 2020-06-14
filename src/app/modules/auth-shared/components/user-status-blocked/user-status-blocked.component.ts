import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BrandParamsService } from '../../../brand/services/brand-params.service';

@Component({
  selector: 'app-user-status-blocked',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-status-blocked.component.html',
  styleUrls: ['./user-status-blocked.component.scss']
})
export class UserStatusBlockedComponent implements OnInit {
  supportEmail: string;

  constructor(private brandParamsService: BrandParamsService) { }

  ngOnInit() {
    this.brandParamsService.getConfig('supportEmail')
      .subscribe(configValue => this.supportEmail = configValue);
  }

}
