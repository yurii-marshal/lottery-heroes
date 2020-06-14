import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map, publishReplay, refCount } from 'rxjs/operators';

import { MetaService } from '../../modules/meta/services/meta.service';
import { CombosService } from '../../services/combos/combos.service';
import { ComboItemModel } from '../../models/combo.model';

@Component({
  selector: 'app-combos-page-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-combos-page
      [mainCombo]="(combosList$|async)[0]"
      [topCombos]="combosList$|async|slice:1:4"
      [otherCombos]="combosList$|async|slice:4"
    ></app-combos-page>
  `
})
export class CombosPageContainerComponent implements OnInit {
  combosList$: Observable<ComboItemModel[]>;

  constructor(private metaService: MetaService,
              private combosService: CombosService,
              private route: ActivatedRoute) {
    this.combosList$ = this.route.data
      .pipe(
        map(data => data.comboList),
        publishReplay(1),
        refCount()
      );
  }

  ngOnInit() {
    this.metaService.setFromConfig('page', 'combos');
  }
}
