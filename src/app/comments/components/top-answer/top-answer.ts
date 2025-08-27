import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsService } from '../../services/comments-service';
import { CommentUtilsService } from '../../services/comment-utils.service';
import { TopComment } from '../../interfaces/top-comment';
import { Answer } from '../../interfaces/all-answers';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-top-answer',
  imports: [CommonModule],
  templateUrl: './top-answer.html',
  styleUrl: './top-answer.scss'
})
export class TopAnswer {

  protected topComment!: TopComment;
  protected answers: Answer[] = [];
  protected isLoading = true;

  constructor(
    private commentService: CommentsService, 
    private route: ActivatedRoute,
    protected commentUtils: CommentUtilsService
  ) {
    const questionId = route.snapshot.params['id'];
    
    // Get top answer
    commentService.getTopAnswer(questionId).subscribe({
      next: (comment) => {
      this.topComment = comment;
      console.log('Top comment:', this.topComment);
      this.isLoading = false;
      },
      error: (err) => {
      console.error('Error fetching top comment:', err);
      this.isLoading = false;
      }
    });
    
    // Get all other answers
    commentService.getAllAnswers(questionId).subscribe(answers => {
      this.answers = answers;
      console.log('All answers:', this.answers);
    });
  }




  // Use the shared toggleReplyForm method from CommentUtilsService
  public toggleReplyForm(event: Event): void {
    this.commentUtils.toggleReplyForm(event);
  }


  public postComment(comment: string, parentId?: string, userId?: string): void {
    this.commentUtils.postComment(comment, parentId, userId); 
  }
}