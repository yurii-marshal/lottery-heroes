import { NgModule } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { LinesRoutingModule } from './lines-routing.module';
import { LinesComponent } from './lines/lines.component';
import { SharedModule } from '../../../modules/shared/shared.module';
import { MygamesTableComponent } from './mygames-table/mygames-table.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { StatusGameComponent } from './mygames-table/status-game.component';
import { MygamesService } from './mygames.service';

@NgModule({
  imports: [
    SharedModule,
    LinesRoutingModule,
    Ng2SmartTableModule
  ],
  entryComponents: [StatusGameComponent],
  declarations: [
    LinesComponent,
    MygamesTableComponent,
    StatusGameComponent,
  ],
  providers: [DecimalPipe, MygamesService]
})
export class LinesModule { }
