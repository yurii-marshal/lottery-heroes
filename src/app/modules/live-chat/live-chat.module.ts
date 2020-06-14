import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveChatDirective } from './directives/live-chat.directive';
import { LiveChatComponent } from './live-chat.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    LiveChatComponent,
    LiveChatDirective,
  ],
  exports: [
    LiveChatComponent,
    LiveChatDirective
  ]
})
export class LiveChatModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LiveChatModule,
      providers: []
    };
  }
}
