import { Component, Input } from '@angular/core';

import { DrawInterface } from '../../../../../modules/api/entities/incoming/lotteries/draws.interface';

@Component({
  selector: 'app-results-draw-description',
  templateUrl: './results-draw-description.component.html',
  styleUrls: ['./results-draw-description.component.scss']
})
export class ResultsDrawDescriptionComponent {
  @Input() draw: DrawInterface;

}
