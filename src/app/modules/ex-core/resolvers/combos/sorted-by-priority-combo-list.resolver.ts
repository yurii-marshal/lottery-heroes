import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { CombosService } from '../../../../services/combos/combos.service';
import { ComboItemModel } from '../../../../models/combo.model';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

@Injectable()
export class SortedByPriorityComboListResolver implements Resolve<ComboItemModel[]> {

  constructor(private combosService: CombosService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ComboItemModel[]> {
    return this.combosService.getSortedByPriorityDisplayedCombosList('combos').first();
  }
}
