import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EnterPasswordComponent } from './components/enter-password/enter-password.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', component: EnterPasswordComponent}
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class ResetPasswordRoutingModule {
}
