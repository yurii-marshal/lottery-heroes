import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SafeAndSecureUkContainerComponent } from './safe-and-secure-uk.container.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', component: SafeAndSecureUkContainerComponent}
    ])
  ],
  exports: [
    RouterModule
  ],
})
export class SafeAndSecureUkRoutingModule { }
