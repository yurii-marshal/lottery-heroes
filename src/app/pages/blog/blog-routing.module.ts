import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BlogContainerComponent } from './blog.container.component';
import { BlogPostContainerComponent } from './modules/blog-post/blog-post.container.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: BlogContainerComponent,
        children: [
          {
            path: 'page/:page',
            component: BlogContainerComponent,
          },
          {
            path: 'blog',
            component: BlogContainerComponent,
            data: {categorySlug: 'blog'}
          },
          {
            path: 'blog/page/:page',
            component: BlogContainerComponent,
            data: {categorySlug: 'blog'}
          },
          {
            path: 'lottery-news',
            component: BlogContainerComponent,
            data: {categorySlug: 'lottery-news'}
          },
          {
            path: 'lottery-news/page/:page',
            component: BlogContainerComponent,
            data: {categorySlug: 'lottery-news'}
          },
          {
            path: 'lottery-winners-stories',
            component: BlogContainerComponent,
            data: {categorySlug: 'lottery-winners-stories'}
          },
          {
            path: 'lottery-winners-stories/page/:page',
            component: BlogContainerComponent,
            data: {categorySlug: 'lottery-winners-stories'}
          },
        ]
      },
      {
        path: ':postSlug',
        component: BlogPostContainerComponent,
      },
    ])
  ],
  exports: [RouterModule]
})
export class BlogRoutingModule {
}
