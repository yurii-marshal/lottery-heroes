import { NgModule } from '@angular/core';
import { AuthComponent } from './components/auth/auth.component';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthContainerComponent } from './components/auth-container/auth-container.component';
import { AuthSharedModule } from '../../../modules/auth-shared/auth-shared.module';
import { SharedModule } from '../../../modules/shared/shared.module';
import { StepsModule } from '../../../modules/steps/steps.module';

@NgModule({
  imports: [
    SharedModule,
    StepsModule,
    AuthRoutingModule,
    AuthSharedModule,
  ],
  declarations: [AuthComponent, AuthContainerComponent]
})
export class AuthModule { }
