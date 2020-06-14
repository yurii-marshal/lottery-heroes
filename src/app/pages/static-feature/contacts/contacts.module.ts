import { NgModule } from '@angular/core';
import { ContactsComponent } from './components/contacts/contacts.component';
import { ContactsRoutingModule } from './contacts-routing.module';
import { FormComponent } from './components/form/form.component';
import { SharedModule } from '../../../modules/shared/shared.module';

@NgModule({
  imports: [
    ContactsRoutingModule,
    SharedModule
  ],
  declarations: [
    ContactsComponent,
    FormComponent
  ]
})
export class ContactsModule {
}
