import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-how-to-play-box',
  templateUrl: './how-to-play-box.component.html',
  styleUrls: ['./how-to-play-box.component.scss']
})
export class HowToPlayBoxComponent {
  @Input() cms: any;
}
