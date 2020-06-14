import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContactsComponent } from './components/contacts/contacts.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', component: ContactsComponent}
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class ContactsRoutingModule {
}

