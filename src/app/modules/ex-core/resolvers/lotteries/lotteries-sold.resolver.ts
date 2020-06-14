import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { LotteriesService } from '../../../../services/lotteries/lotteries.service';
import { LotteriesMapInterface } from '../../../../services/lotteries/entities/interfaces/lotteries-map.interface';
import { ObjectsUtil } from '../../../shared/utils/objects.util';

@Injectable()
export class LotteriesSoldResolver implements Resolve<LotteriesMapInterface> {
  constructor(private lotteriesService: LotteriesService) {
  }

  resolve(): Observable<LotteriesMapInterface> {
    return this.lotteriesService.getSoldLotteriesMap()
      .filter((lotteriesMap: LotteriesMapInterface) => !ObjectsUtil.isEmptyObject(lotteriesMap))
      .first();
  }
}
