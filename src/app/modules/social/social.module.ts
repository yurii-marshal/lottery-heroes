import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialContainerComponent } from './social-container/social-container.component';
import { SocialButtonComponent } from './social-button/social-button.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    SocialContainerComponent,
    SocialButtonComponent,
  ],
  exports: [
    SocialContainerComponent
  ]
})
export class SocialModule {
}
