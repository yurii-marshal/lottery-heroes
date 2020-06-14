import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CmsService } from './services/cms.service';

@NgModule({
  imports: [HttpClientModule],
  providers: [CmsService]
})
export class CmsModule {
}
