import { Component, OnInit } from '@angular/core';
import { MetaService } from '../../../modules/meta/services/meta.service';
import { BrandParamsService } from '../../../modules/brand/services/brand-params.service';

@Component({
  selector: 'app-bet-vs-play-container',
  template: `<ng-container *ngIf="showBetVsPlay; else page404">
              <app-bet-vs-play></app-bet-vs-play>
             </ng-container>
             <ng-template #page404>
               <app-page404></app-page404>
             </ng-template>`
})
export class BetVsPlayContainerComponent implements OnInit {
  showBetVsPlay: boolean;

  constructor(private metaService: MetaService,
              private brandParamsService: BrandParamsService) {
  }

  ngOnInit() {
    this.brandParamsService.getConfig('header', 'showBetVsPlay')
      .subscribe(configValue => {
        this.showBetVsPlay = configValue;
        if (this.showBetVsPlay) {
          this.metaService.setFromConfig('page', 'bet-vs-play');
        } else {
          this.metaService.setFromConfig('page', '404');
        }
      });
  }

}
