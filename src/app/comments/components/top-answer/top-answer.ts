import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentsService } from '../../services/comments-service';
import { CommentUtilsService } from '../../services/comment-utils.service';
import { QuestionsService } from '../../../questions/services/questions-service';
import { TopComment, Answer } from '../../interfaces/comment';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../users/services/auth';
import { FlashMessageService } from '../../../shared/services/flash-message.service';

@Component({
  selector: 'app-top-answer',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './top-answer.html',
  styleUrl: './top-answer.scss'
})
export class TopAnswer {

  protected topComment!: TopComment;
  protected answers: Answer[] = [];
  protected isLoading = true;
  protected answerForm: FormGroup;
  protected replyForms: Map<string, FormGroup> = new Map();
  protected isSubmitting = false;
  protected isVoting = false;
  protected isLogged = false;
  private questionId!: string;

  constructor(
    private commentService: CommentsService, 
    private route: ActivatedRoute,
    protected commentUtils: CommentUtilsService,
    private questionsService: QuestionsService,
    private fb: FormBuilder,
    private authService: AuthService,
    private flashMessage: FlashMessageService
  ) {
    this.isLogged = this.authService.isLoggedIn();
    this.questionId = route.snapshot.params['id'];
    
    // Initialize answer form
    this.answerForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(1)]]
    });
    
    // Get top answer
    commentService.getTopAnswer(this.questionId).subscribe({
      next: (comment) => {
      this.topComment = comment;
      this.isLoading = false;
      },
      error: (err) => {
      this.isLoading = false;
      }
    });
    
    // Get all other answers
    commentService.getAllAnswers(this.questionId).subscribe(answers => {
      this.answers = answers;
    });
  }




  // Use the shared toggleReplyForm method from CommentUtilsService
  public toggleReplyForm(event: Event): void {
    this.commentUtils.toggleReplyForm(event);
  }

  public postComment(comment: string, parentId: string | null = null, type: 'comment' | 'answer' = 'answer'): void {
    this.commentUtils.postComment(comment, parentId, type); 
  }

  public onSubmitAnswer(): void {
    if (!this.isLogged) {
      this.flashMessage.showLoginRequired('post an answer');
      return;
    }
    if (this.answerForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const content = this.answerForm.get('content')?.value;
      
      this.questionsService.postComment(content, this.questionId, null, 'answer').subscribe({
        next: (response) => {
          this.answerForm.reset();
          this.isSubmitting = false;
          // Refresh answers
          this.loadAnswers();
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
          // Refresh answers
          this.loadAnswers();
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

  private loadAnswers(): void {
    // Reload both top answer and all answers
    this.commentService.getTopAnswer(this.questionId).subscribe({
      next: (comment) => {
        this.topComment = comment;
      },
      error: (err) => {
      }
    });
    
    this.commentService.getAllAnswers(this.questionId).subscribe(answers => {
      this.answers = answers;
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
    // Update votes in top comment
    if (this.topComment && this.topComment.id === commentId) {
      this.topComment.votes = newVoteCount;
      return;
    }

    // Update votes in top comment replies
    if (this.topComment && this.topComment.replies) {
      this.updateVotesInReplies(this.topComment.replies, commentId, newVoteCount);
    }

    // Update votes in other answers
    this.answers.forEach(answer => {
      if (answer.id === commentId) {
        answer.votes = newVoteCount;
      } else if (answer.replies) {
        this.updateVotesInReplies(answer.replies, commentId, newVoteCount);
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