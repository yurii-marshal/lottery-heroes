import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HowToPlayContainerComponent } from './how-to-play-container.component';

const routes: Routes = [
  {
    path: '',
    component: HowToPlayContainerComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class HowToPlayRoutingModule {
}
