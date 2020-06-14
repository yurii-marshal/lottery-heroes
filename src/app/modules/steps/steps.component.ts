import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-steps',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss']
})
export class StepsComponent {
  @Input() activeStep: number;

  @Input() firstStepText: string;
  @Input() secondStepText: string;
  @Input() thirdStepText: string;
}
