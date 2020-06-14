import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';

import { SyndicateModel } from '../models/syndicate.model';
import { SyndicatesQueryService } from '../services/queries/syndicates-query.service';

@Injectable()
export class SyndicatesResolver implements Resolve<{[lotteryId: string]: SyndicateModel}> {
  constructor(private syndicatesQueryService: SyndicatesQueryService) {
  }

  resolve(): Observable<{[lotteryId: string]: SyndicateModel}> {
    return this.syndicatesQueryService.getSyndicateModelsMap()
      .pipe(
        first()
      );
  }
}
