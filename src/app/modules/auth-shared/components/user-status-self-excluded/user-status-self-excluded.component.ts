import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BrandParamsService } from '../../../brand/services/brand-params.service';

@Component({
  selector: 'app-user-status-self-excluded',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-status-self-excluded.component.html',
  styleUrls: ['./user-status-self-excluded.component.scss']
})
export class UserStatusSelfExcludedComponent implements OnInit {
  supportEmail: string;

  constructor(private brandParamsService: BrandParamsService) { }

  ngOnInit() {
    this.brandParamsService.getConfig('supportEmail')
      .subscribe(configValue => this.supportEmail = configValue);
  }

}
