import { Component, OnInit } from '@angular/core';
import { BrandParamsService } from '../../../../modules/brand/services/brand-params.service';
import { MetaService } from '../../../../modules/meta/services/meta.service';

@Component({
  selector: 'app-safe-and-secure-uk-container',
  template: `<ng-container *ngIf="showSafeSecure; else page404">
              <app-safe-and-secure-uk></app-safe-and-secure-uk>
             </ng-container>
             <ng-template #page404>
               <app-page404></app-page404>
             </ng-template>`
})
export class SafeAndSecureUkContainerComponent implements OnInit {
  showSafeSecure: boolean;

  constructor(private brandParamsService: BrandParamsService,
              private metaService: MetaService) {
  }

  ngOnInit() {
    this.brandParamsService.getConfig('aboutPageMenu', 'showMenuItem')
      .subscribe(configValue => {
        this.showSafeSecure = configValue.safeAndSecure;
        if (this.showSafeSecure) {
           this.metaService.setFromConfig('page', 'safe-and-secure');
        } else {
          this.metaService.setFromConfig('page', '404');
        }
      });
  }

}
