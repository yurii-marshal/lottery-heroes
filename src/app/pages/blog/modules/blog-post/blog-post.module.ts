import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogPostComponent } from './components/blog-post/blog-post.component';
import { BlogPostContainerComponent } from './blog-post.container.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../modules/shared/shared.module';
import { TrandingNowModule } from './modules/tranding-now/tranding-now.module';
import { Page404Module } from '../../../../modules/page404/page404.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    TrandingNowModule,
    Page404Module,
  ],
  declarations: [
    BlogPostContainerComponent,
    BlogPostComponent,
  ],
  exports: [
    BlogPostContainerComponent,
  ]
})
export class BlogPostModule { }
