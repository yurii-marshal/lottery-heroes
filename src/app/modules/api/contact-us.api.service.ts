import { Injectable } from '@angular/core';

import { BaseApiService } from './base.api.service';
import { ContactUsInterface } from './entities/incoming/contact-us.interface';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ContactUsApiService {

  constructor(private baseApiService: BaseApiService) {
  }

  sendContactForm(letterObj: ContactUsInterface): Observable<any> {
    return this.baseApiService.post('/communications/contact-us', letterObj);
  }
}
