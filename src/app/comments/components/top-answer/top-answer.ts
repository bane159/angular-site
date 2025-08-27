import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentsService } from '../../services/comments-service';
import { CommentUtilsService } from '../../services/comment-utils.service';
import { QuestionsService } from '../../../questions/services/questions-service';
import { TopComment } from '../../interfaces/top-comment';
import { Answer } from '../../interfaces/all-answers';
import { ActivatedRoute } from '@angular/router';

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
  private questionId!: string;

  constructor(
    private commentService: CommentsService, 
    private route: ActivatedRoute,
    protected commentUtils: CommentUtilsService,
    private questionsService: QuestionsService,
    private fb: FormBuilder
  ) {
    this.questionId = route.snapshot.params['id'];
    
    // Initialize answer form
    this.answerForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(1)]]
    });
    
    // Get top answer
    commentService.getTopAnswer(this.questionId).subscribe({
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
    commentService.getAllAnswers(this.questionId).subscribe(answers => {
      this.answers = answers;
      console.log('All answers:', this.answers);
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
    if (this.answerForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const content = this.answerForm.get('content')?.value;
      
      this.questionsService.postComment(content, this.questionId, null, 'answer').subscribe({
        next: (response) => {
          console.log('Answer posted successfully:', response);
          this.answerForm.reset();
          this.isSubmitting = false;
          // Refresh answers
          this.loadAnswers();
        },
        error: (error) => {
          console.error('Error posting answer:', error);
          this.isSubmitting = false;
        }
      });
    }
  }

  public onSubmitReply(commentId: number): void {
    const commentIdStr = commentId.toString();
    const replyForm = this.replyForms.get(commentIdStr);
    if (replyForm?.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const content = replyForm.get('content')?.value;
      
      this.questionsService.postComment(content, this.questionId, commentIdStr, 'comment').subscribe({
        next: (response) => {
          console.log('Reply posted successfully:', response);
          replyForm.reset();
          this.isSubmitting = false;
          // Refresh answers
          this.loadAnswers();
        },
        error: (error) => {
          console.error('Error posting reply:', error);
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
        console.error('Error fetching top comment:', err);
      }
    });
    
    this.commentService.getAllAnswers(this.questionId).subscribe(answers => {
      this.answers = answers;
    });
  }

  // Voting methods
  public upvoteComment(commentId: number): void {
    if (this.isVoting) return;
    
    this.isVoting = true;
    this.questionsService.voteOnComment(commentId, 'upvote').subscribe({
      next: (response) => {
        console.log('Upvote successful:', response);
        this.updateCommentVotes(commentId, response.current_votes);
        this.isVoting = false;
      },
      error: (error) => {
        console.error('Error upvoting comment:', error);
        this.isVoting = false;
      }
    });
  }

  public downvoteComment(commentId: number): void {
    if (this.isVoting) return;
    
    this.isVoting = true;
    this.questionsService.voteOnComment(commentId, 'downvote').subscribe({
      next: (response) => {
        console.log('Downvote successful:', response);
        this.updateCommentVotes(commentId, response.current_votes);
        this.isVoting = false;
      },
      error: (error) => {
        console.error('Error downvoting comment:', error);
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