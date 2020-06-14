import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-blog-paginator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './blog-paginator.component.html',
  styleUrls: ['./blog-paginator.component.scss']
})
export class BlogPaginatorComponent {
  @Input() totalPages: number;
  @Input() activePage: number;
}
