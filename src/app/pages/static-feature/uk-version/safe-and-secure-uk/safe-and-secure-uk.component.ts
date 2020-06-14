import { Component } from '@angular/core';
import { ScrollService } from '../../../../services/device/scroll.service';

@Component({
  selector: 'app-safe-and-secure-uk',
  templateUrl: './safe-and-secure-uk.component.html',
  styleUrls: ['./safe-and-secure-uk.component.scss']
})
export class SafeAndSecureUkComponent {

  constructor(private scrollService: ScrollService) {
  }

  scrollTo(nativeElement: HTMLElement): void {
    this.scrollService.scrollToSmooth(nativeElement);
  }
}
