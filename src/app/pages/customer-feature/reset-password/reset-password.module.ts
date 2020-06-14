import { NgModule } from '@angular/core';
import { ResetPasswordRoutingModule } from './reset-routing.module';
import { EnterPasswordComponent } from './components/enter-password/enter-password.component';
import { EnterCodeComponent } from './components/enter-code/enter-code.component';
import { SharedModule } from '../../../modules/shared/shared.module';
import {
  PasswordUpdateSuccessfullyComponent
} from '../../../modules/auth-shared/components/password-update-successfully/password-update-successfully.component';

@NgModule({
  imports: [
    SharedModule,
    ResetPasswordRoutingModule,
  ],
  declarations: [EnterPasswordComponent, EnterPasswordComponent, EnterCodeComponent, PasswordUpdateSuccessfullyComponent]
})
export class ResetPasswordModule {
}
