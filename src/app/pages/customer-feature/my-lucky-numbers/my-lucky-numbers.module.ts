import { NgModule } from '@angular/core';
import { MyLuckyNumbersRoutingModule } from './my-lucky-numbers-routing.module';
import { MyLuckyNumbersComponent } from './components/my-lucky-numbers/my-lucky-numbers.component';
import { SharedModule } from '../../../modules/shared/shared.module';

import { MyLuckyNumbersSandbox } from './my-lucky-numbers.sandbox';

import { MyLuckyNumbersContainerComponent } from './my-lucky-numbers.container.component';
import { MyLuckyNumbersEditComponent } from './components/my-lucky-numbers-edit/my-lucky-numbers-edit.component';
import { MyLuckyNumbersSavedComponent } from './components/my-lucky-numbers-saved/my-lucky-numbers-saved.component';
import { MyLuckyNumbersLineComponent } from './components/my-lucky-numbers-line/my-lucky-numbers-line.component';
import { NewEmptyLineComponent } from './components/new-empty-line/new-empty-line.component';
import { NoLuckyNumbersComponent } from './components/no-lucky-numbers/no-lucky-numbers.component';

@NgModule({
  imports: [
    SharedModule,
    MyLuckyNumbersRoutingModule,
  ],
  declarations: [
    MyLuckyNumbersComponent,
    MyLuckyNumbersEditComponent,
    MyLuckyNumbersSavedComponent,
    MyLuckyNumbersLineComponent,
    MyLuckyNumbersContainerComponent,
    NewEmptyLineComponent,
    NoLuckyNumbersComponent,
  ],
  exports: [
    MyLuckyNumbersEditComponent,
    MyLuckyNumbersSavedComponent,
    MyLuckyNumbersLineComponent,
    NewEmptyLineComponent
  ],
  providers: [
    MyLuckyNumbersSandbox,
  ],
})
export class MyLuckyNumbersModule { }
