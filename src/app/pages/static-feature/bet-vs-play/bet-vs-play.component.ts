import { Component } from '@angular/core';
import { BrandParamsService } from '../../../modules/brand/services/brand-params.service';

@Component({
  selector: 'app-bet-vs-play',
  templateUrl: './bet-vs-play.component.html',
  styleUrls: ['./bet-vs-play.component.scss']
})
export class BetVsPlayComponent {
  brandId: string;

  constructor(private brandParamsService: BrandParamsService) {
    this.brandId = this.brandParamsService.getBrandId();
  }

}
