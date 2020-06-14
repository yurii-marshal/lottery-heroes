import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'app-lightbox-limited-deposit',
  templateUrl: './lightbox-limited-deposit.component.html',
  styleUrls: ['./lightbox-limited-deposit.component.scss']
})
export class LightboxLimitedDepositComponent implements OnInit {
  isShow = false;
  constructor(private globalService: GlobalService) { }

  ngOnInit() {
    this.globalService.showLightbox$
      .filter(params => params['name'] === 'deposit_limit')
      .subscribe(
        params => {
          this.isShow = true;
        }
      );
  }

  closeLightbox() {
    this.isShow = false;
  }

}
