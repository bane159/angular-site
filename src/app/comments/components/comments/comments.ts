import { Component, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsService } from '../../services/comments-service';
import { CommentUtilsService } from '../../services/comment-utils.service';
import { Comment } from '../../interfaces/comment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-comments',
  imports: [CommonModule],
  templateUrl: './comments.html',
  styleUrl: './comments.scss'
})
export class Comments {
  protected comments: Comment[] = [];
  private questionId!: string;
  @Input('qu-id') quId!: string;
  protected isLoading: boolean = true;

  constructor(
    protected commentService: CommentsService, 
    private route: ActivatedRoute,
    protected commentUtils: CommentUtilsService
  ) {
     this.questionId = route.snapshot.params['id'];
    
    // Get general comments
    
  }

  public toggleReplyForm(event: Event): void {
    this.commentUtils.toggleReplyForm(event);
  }

  public ngOnInit(){
    this.commentService.getGeneralComments(this.questionId).subscribe({
      next: (comments) => {
      this.comments = comments;
      console.log('General comments:', this.comments);
      this.isLoading = false;
      },
      error: (err) => {
      console.error('Error fetching comments:', err);
      this.isLoading = false;
      }
    });
  }

  public postComment(comment: string, parentId?: string, userId?: string): void {
    this.commentUtils.postComment(comment, parentId, userId);
  }
}
