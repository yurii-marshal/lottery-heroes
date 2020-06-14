import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import {BundlesService} from '../../../../services/bundles/bundles.service';
import {BundleItemModel} from '../../../../models/bundle.model';

@Injectable()
export class SortedByPriorityBundleListResolver implements Resolve<BundleItemModel[]> {

  constructor(private bundlesService: BundlesService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BundleItemModel[]> {
    return this.bundlesService.getSortedByPriorityDisplayedBundlesList('bundles').first();
  }
}
