import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { BlogContainerComponent } from './blog.container.component';
import { BlogComponent } from './components/blog/blog.component';
import { BlogPaginatorComponent } from './components/blog-paginator/blog-paginator.component';
import { PostsListComponent } from './components/posts-list/posts-list.component';
import { SocialModule } from '../../modules/social/social.module';
import { BlogPostModule } from './modules/blog-post/blog-post.module';
import { SharedModule } from '../../modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    BlogRoutingModule,
    BlogPostModule,
    SocialModule,
    SharedModule,
  ],
  declarations: [
    BlogContainerComponent,
    BlogComponent,
    BlogPaginatorComponent,
    PostsListComponent,
  ]
})
export class BlogModule {
}
