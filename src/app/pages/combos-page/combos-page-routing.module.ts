import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CombosPageContainerComponent } from './combos-page.container.component';
import { OfferingsCombosResolver } from '../../modules/ex-core/resolvers/offerings/offerings-combos.resolver';
import { SortedByPriorityComboListResolver } from '../../modules/ex-core/resolvers/combos/sorted-by-priority-combo-list.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: CombosPageContainerComponent,
        resolve: {
          offeringsCombos: OfferingsCombosResolver,
          comboList: SortedByPriorityComboListResolver
        },
        pathMatch: 'full'
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class CombosPageRoutingModule { }
