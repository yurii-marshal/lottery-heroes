import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BlogPostComponent {

  @Input() post: any;
  @Input() host: string;
}
