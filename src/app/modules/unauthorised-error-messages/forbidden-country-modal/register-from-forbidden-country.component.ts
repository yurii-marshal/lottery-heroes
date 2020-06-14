import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BrandParamsService } from '../../brand/services/brand-params.service';

@Component({
  selector: 'app-register-from-forbidden-country',
  templateUrl: './register-from-forbidden-country.component.html',
  styleUrls: ['./register-from-forbidden-country.component.scss']
})
export class RegisterFromForbiddenCountryComponent implements OnInit {
  @Output() showAnotherComponent = new EventEmitter<String>();

  supportEmail: string;

  constructor(private brandParamsService: BrandParamsService) { }

  ngOnInit(): void {
    this.brandParamsService.getConfig('supportEmail')
      .subscribe(configValue => this.supportEmail = configValue);
  }

  showNewComponent(name: string) {
    this.showAnotherComponent.emit(name);
  }

}
