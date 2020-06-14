import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { DrawInterface } from '../../../../../modules/api/entities/incoming/lotteries/draws.interface';

@Component({
  selector: 'app-results-draw-facts',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './results-draw-facts.component.html',
  styleUrls: ['./results-draw-facts.component.scss']
})
export class ResultsDrawFactsComponent {
  @Input() draw: DrawInterface;
}
