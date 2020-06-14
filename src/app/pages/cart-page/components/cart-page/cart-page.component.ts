import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cart-page-component',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss'],
})
export class CartPageComponent {
  @Input() expandedLines: boolean;
}
