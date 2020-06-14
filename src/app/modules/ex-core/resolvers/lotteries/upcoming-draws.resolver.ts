import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DrawsService } from '../../../../services/lotteries/draws.service';
import { DrawsMapInterface } from '../../../../services/lotteries/entities/interfaces/draws-map.interface';
import { ObjectsUtil } from '../../../shared/utils/objects.util';

@Injectable()
export class UpcomingDrawsResolver implements Resolve<DrawsMapInterface> {
  constructor(private drawsService: DrawsService) {
  }

  resolve(): Observable<DrawsMapInterface> {
    return this.drawsService.getUpcomingDrawsMap()
      .filter((drawsMap: DrawsMapInterface) => !ObjectsUtil.isEmptyObject(drawsMap))
      .first();
  }
}
