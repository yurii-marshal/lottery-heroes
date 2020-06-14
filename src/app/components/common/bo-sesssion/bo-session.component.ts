import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-bo-session',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bo-session.component.html',
  styleUrls: ['./bo-session.component.scss']
})
export class BoSessionComponent {
  @Input() text: string;
}
