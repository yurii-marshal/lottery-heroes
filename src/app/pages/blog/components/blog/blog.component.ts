import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-blog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent {
  @Input() posts: Array<any>;
  @Input() host: string;
  @Input() totalPages: number;
  @Input() activePage: number;
}
