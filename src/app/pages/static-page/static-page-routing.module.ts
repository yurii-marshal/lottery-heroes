import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { StaticPageContainerComponent } from './static-page-container.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: StaticPageContainerComponent,
      }
    ])
  ],
  exports: [RouterModule]
})
export class StaticPageRoutingModule {
}
