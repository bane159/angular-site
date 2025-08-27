import { Injectable } from '@angular/core';
import { QuestionsService } from '../../questions/services/questions-service';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommentUtilsService {

  constructor(
    private questionsService: QuestionsService,
    private route: ActivatedRoute
  ) {}

  /**
   * Toggles the visibility of a reply form
   * Can be used in any comment component
   */
  public toggleReplyForm(event: Event): void {
    console.log('Toggle reply form');
    const button = event.target as HTMLElement;
    if (!button) return;
    
    // Find the closest reply form
    let parent = button.closest('.action-buttons') || button.closest('.comment-actions');
    let container = parent?.closest('.comment-content');
    let replyForm = button.closest('.reply-form') as HTMLElement | null;

    // If we clicked a cancel button
    if (button.classList.contains('cancel-reply')) {
      // Hide this specific reply form
      if (replyForm) {
        replyForm.style.display = 'none';
      }
      return;
    }
    
    // Otherwise, find the next reply form after the button's container
    if (container) {
      const foundForm = Array.from(container.querySelectorAll('.reply-form')).find(form =>
        (form as HTMLElement).closest('.comment-content') === container
      );
      replyForm = foundForm ? (foundForm as HTMLElement) : null;
      
      if (replyForm) {
        replyForm.style.display = replyForm.style.display === 'none' ? 'block' : 'none';
      }
    }
  }



  public postComment(
    comment: string, 
    parentId: string | null = null, 
    type: 'comment' | 'answer' = 'comment'
  ): void {
    console.log('Post comment:', comment);
    
    const questionId = this.route.snapshot.params['id'];
    
    if (!questionId) {
      console.error('No question ID found');
      return;
    }

    if (!comment.trim()) {
      console.error('Comment content is required');
      return;
    }

    this.questionsService.postComment(comment, questionId, parentId, type).subscribe({
      next: (response) => {
        console.log('Comment posted successfully:', response);
        // You might want to emit an event or return an observable here
        // to notify the components to refresh their data
      },
      error: (error) => {
        console.error('Error posting comment:', error);
      }
    });
  }
}
