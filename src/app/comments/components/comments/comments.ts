import { Component, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentsService } from '../../services/comments-service';
import { CommentUtilsService } from '../../services/comment-utils.service';
import { QuestionsService } from '../../../questions/services/questions-service';
import { Comment } from '../../interfaces/comment';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../users/services/auth';
import { FlashMessageService } from '../../../shared/services/flash-message.service';

@Component({
  selector: 'app-comments',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './comments.html',
  styleUrl: './comments.scss'
})
export class Comments {
  protected comments: Comment[] = [];
  private questionId!: string;
  @Input('qu-id') quId!: number;
  protected isLoading: boolean = true;
  protected commentForm: FormGroup;
  protected replyForms: Map<string, FormGroup> = new Map();
  protected isSubmitting = false;
  protected isVoting = false;
  protected isLogged = false;

  constructor(
    protected commentService: CommentsService, 
    private route: ActivatedRoute,
    protected commentUtils: CommentUtilsService,
    private questionsService: QuestionsService,
    private fb: FormBuilder,
    private authService: AuthService,
    private flashMessage: FlashMessageService
  ) {
     this.isLogged = this.authService.isLoggedIn();
     this.questionId = route.snapshot.params['id'];
     
     
     this.commentForm = this.fb.group({
       content: ['', [Validators.required, Validators.minLength(1)]]
     });
    
   
    
  }

  public toggleReplyForm(event: Event): void {
    this.commentUtils.toggleReplyForm(event);
  }

  public ngOnInit(){
    this.loadComments();
  }

  public postComment(comment: string, parentId: string | null = null, type: 'comment' | 'answer' = 'comment'): void {
    this.commentUtils.postComment(comment, parentId, type);
  }

  public onSubmitComment(): void {
    if (!this.isLogged) {
      this.flashMessage.showLoginRequired('post a comment');
      return;
    }
    if (this.commentForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const content = this.commentForm.get('content')?.value;
      
      this.questionsService.postComment(content, this.questionId, null, 'comment').subscribe({
        next: (response) => {
          this.commentForm.reset();
          this.isSubmitting = false;
          // Refresh comments
          this.loadComments();
        },
        error: (error) => {
          this.isSubmitting = false;
        }
      });
    }
  }

  public onSubmitReply(commentId: number): void {
    if (!this.isLogged) {
      this.flashMessage.showLoginRequired('post a reply');
      return;
    }
    const commentIdStr = commentId.toString();
    const replyForm = this.replyForms.get(commentIdStr);
    if (replyForm?.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const content = replyForm.get('content')?.value;
      
      this.questionsService.postComment(content, this.questionId, commentIdStr, 'comment').subscribe({
        next: (response) => {
          replyForm.reset();
          this.isSubmitting = false;
          // Refresh comments
          this.loadComments();
        },
        error: (error) => {
          this.isSubmitting = false;
        }
      });
    }
  }

  public getReplyForm(commentId: number): FormGroup {
    const commentIdStr = commentId.toString();
    if (!this.replyForms.has(commentIdStr)) {
      this.replyForms.set(commentIdStr, this.fb.group({
        content: ['', [Validators.required, Validators.minLength(1)]]
      }));
    }
    return this.replyForms.get(commentIdStr)!;
  }

  private loadComments(): void {
    this.commentService.getGeneralComments(this.questionId).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  }

  // Voting methods
  public upvoteComment(commentId: number): void {
    if (!this.isLogged) {
      this.flashMessage.showLoginRequired('vote on a comment');
      return;
    }
    if (this.isVoting) return;
    
    this.isVoting = true;
    this.questionsService.voteOnComment(commentId, 'upvote').subscribe({
      next: (response) => {
        this.updateCommentVotes(commentId, response.current_votes);
        this.isVoting = false;
      },
      error: (error) => {
        this.isVoting = false;
      }
    });
  }

  public downvoteComment(commentId: number): void {
    if (!this.isLogged) {
      this.flashMessage.showLoginRequired('vote on a comment');
      return;
    }
    if (this.isVoting) return;
    
    this.isVoting = true;
    this.questionsService.voteOnComment(commentId, 'downvote').subscribe({
      next: (response) => {
        this.updateCommentVotes(commentId, response.current_votes);
        this.isVoting = false;
      },
      error: (error) => {
        this.isVoting = false;
      }
    });
  }

  private updateCommentVotes(commentId: number, newVoteCount: number): void {
    this.comments.forEach(comment => {
      if (comment.id === commentId) {
        comment.votes = newVoteCount;
      } else if (comment.replies) {
        this.updateVotesInReplies(comment.replies, commentId, newVoteCount);
      }
    });
  }

  private updateVotesInReplies(replies: any[], commentId: number, newVoteCount: number): void {
    replies.forEach(reply => {
      if (reply.id === commentId) {
        reply.votes = newVoteCount;
      } else if (reply.replies && reply.replies.length > 0) {
        this.updateVotesInReplies(reply.replies, commentId, newVoteCount);
      }
    });
  }
}
