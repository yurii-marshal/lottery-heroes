import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-faq-box',
  templateUrl: './faq-box.component.html',
  styleUrls: ['./faq-box.component.scss']
})
export class FaqBoxComponent {

  @Input() cms: any;
}
