import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MyLuckyNumbersContainerComponent } from './my-lucky-numbers.container.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: MyLuckyNumbersContainerComponent
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class MyLuckyNumbersRoutingModule { }
