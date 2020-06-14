import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MetaService } from '../meta/services/meta.service';

@Component({
  selector: 'app-page404',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.scss']
})
export class Page404Component implements OnInit {
  constructor(private metaService: MetaService) {
  }

  ngOnInit(): void {
    this.metaService.setFromConfig('page', '404');
  }
}
