import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsService } from './services/comments-service';
import { CommentUtilsService } from './services/comment-utils.service';
import { TopAnswer } from './components/top-answer/top-answer';
import { Comments } from './components/comments/comments';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    CommentsService,
    CommentUtilsService
  ]
})
export class CommentsModule { }
