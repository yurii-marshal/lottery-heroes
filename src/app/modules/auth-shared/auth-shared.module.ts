import { NgModule } from '@angular/core';
import { EmailSentSuccessfullyComponent } from './components/email-sent-successfully/email-sent-successfully.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { SharedModule } from '../shared/shared.module';
import { UserStatusBlockedComponent } from './components/user-status-blocked/user-status-blocked.component';
import { UserStatusClosedComponent } from './components/user-status-closed/user-status-closed.component';
import { UserStatusSelfExcludedComponent } from './components/user-status-self-excluded/user-status-self-excluded.component';
import {
  RegisterFromForbiddenCountryComponent
} from '../unauthorised-error-messages/forbidden-country-modal/register-from-forbidden-country.component';
import {
  SigninFromForbiddenCountryComponent
} from '../unauthorised-error-messages/signin-from-forbidden-country/signin-from-forbidden-country.component';
import { LiveChatModule } from '../live-chat/live-chat.module';

@NgModule({
  imports: [
    SharedModule,
    LiveChatModule,
  ],
  declarations: [
    SigninComponent,
    SignupComponent,
    ForgotPasswordComponent,
    RegisterFromForbiddenCountryComponent,
    SigninFromForbiddenCountryComponent,
    EmailSentSuccessfullyComponent,
    UserStatusBlockedComponent,
    UserStatusClosedComponent,
    UserStatusSelfExcludedComponent,
  ],
  exports: [
    SigninComponent,
    SignupComponent,
    ForgotPasswordComponent,
    RegisterFromForbiddenCountryComponent,
    SigninFromForbiddenCountryComponent,
    EmailSentSuccessfullyComponent,
    UserStatusBlockedComponent,
    UserStatusClosedComponent,
    UserStatusSelfExcludedComponent,
  ]
})
export class AuthSharedModule { }
