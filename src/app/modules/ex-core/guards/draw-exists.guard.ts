import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DrawsService } from '../../../services/lotteries/draws.service';
import { DrawInterface } from '../../api/entities/incoming/lotteries/draws.interface';

@Injectable()
export class DrawExistsGuard implements CanActivate {
  constructor(private drawsService: DrawsService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.drawsService.getDrawByDate(route.data['lotteryId'], route.params['dateLocal'])
      .first()
      .do((draw: DrawInterface) => {
        if (!draw) {
          this.router.navigate(['/404']);
        }
      })
      .map((draw: DrawInterface) => !!draw);
  }
}
