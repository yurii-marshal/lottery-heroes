import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'app-lightbox-account-unverified',
  templateUrl: './lightbox-account-unverified.component.html',
  styleUrls: ['./lightbox-account-unverified.component.scss']
})
export class LightboxAccountUnverifiedComponent implements OnInit {
  isShow = false;
  errorMessage: string;
  body: any;

  @Output() resendConfirmation = new EventEmitter();

  constructor(private globalService: GlobalService) { }

  ngOnInit() {
    this.globalService.showLightbox$
      .filter(params => params['name'] === 'account-unverified')
      .subscribe(response => {
        this.body = response;
        if (response['value'].statusCode !== 200) {
          this.errorMessage = response['value'].message;
        }
        this.isShow = true;
      });
  }

  closeLightbox() {
    this.isShow = false;
  }

  resend() {
    this.resendConfirmation.emit();
    this.isShow = false;
  }

}
