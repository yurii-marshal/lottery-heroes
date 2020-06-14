import { NgModule } from '@angular/core';
import { RealTimeNotificationsComponent } from './components/real-time-notifications/real-time-notifications.component';
import { RealTimeNotificationsContainerComponent } from './real-time-notifications-container.component';
import { SharedModule } from '../../../../modules/shared/shared.module';


@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    RealTimeNotificationsComponent,
    RealTimeNotificationsContainerComponent,
  ],
  exports: [
    RealTimeNotificationsContainerComponent,
  ],
  entryComponents: [
    RealTimeNotificationsContainerComponent
  ]
})
export class RealTimeNotificationsModule {
}
