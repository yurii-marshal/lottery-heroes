import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PersonalResultsContainerComponent } from './personal-results.container.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: PersonalResultsContainerComponent
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class PersonalResultsRoutingModule { }
