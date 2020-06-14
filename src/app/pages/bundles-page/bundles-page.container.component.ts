import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {map, publishReplay, refCount} from 'rxjs/operators';

import {MetaService} from '../../modules/meta/services/meta.service';
import {BundleItemModel} from '../../models/bundle.model';
import {BundlesService} from '../../services/bundles/bundles.service';

@Component({
  selector: 'app-bundles-page-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-bundles-page
      [mainBundle]="(bundlesList$|async)[0]"
      [topBundles]="bundlesList$|async|slice:1:4"
      [otherBundles]="bundlesList$|async|slice:4"
    ></app-bundles-page>
  `
})
export class BundlesPageContainerComponent implements OnInit {
  bundlesList$: Observable<BundleItemModel[]>;

  constructor(private metaService: MetaService,
              private bundlesService: BundlesService,
              private route: ActivatedRoute) {
    this.bundlesList$ = this.route.data
      .pipe(
        map(data => data.bundleList),
        publishReplay(1),
        refCount()
      );
  }

  ngOnInit() {
    this.metaService.setFromConfig('page', 'bundles');
  }
}
