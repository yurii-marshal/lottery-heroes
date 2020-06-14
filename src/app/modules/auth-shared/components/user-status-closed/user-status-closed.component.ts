import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BrandParamsService } from '../../../brand/services/brand-params.service';

@Component({
  selector: 'app-user-status-closed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-status-closed.component.html',
  styleUrls: ['./user-status-closed.component.scss']
})
export class UserStatusClosedComponent implements OnInit {
  supportEmail: string;

  constructor(private brandParamsService: BrandParamsService) { }

  ngOnInit() {
    this.brandParamsService.getConfig('supportEmail')
      .subscribe(configValue => this.supportEmail = configValue);
  }

}
