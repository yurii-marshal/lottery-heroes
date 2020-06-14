import { Component } from '@angular/core';

@Component({
  selector: 'app-cookies-acceptance',
  templateUrl: './cookies-acceptance.component.html',
  styleUrls: ['./cookies-acceptance.component.scss']
})
export class CookiesAcceptanceComponent {
  constructor() {
  }

  acceptCookieSaving() {
    console.log('save cookies');
  }
}
