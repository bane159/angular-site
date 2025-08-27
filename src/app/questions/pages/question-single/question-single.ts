import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Sidenav } from '../../../components/sidenav/sidenav';
import { IQuestionSingle } from '../../interfaces/iquestion-single';
import { QuestionsService } from '../../services/questions-service';
// import { DatePipe } from '@angular/common';

import { UploadedAgoPipe } from '../../pipes/uploaded-ago-pipe';
import { UserService } from '../../../users/services/user-service';
import { TopAnswer } from "../../../comments/components/top-answer/top-answer";
import { Comments } from "../../../comments/components/comments/comments";

@Component({
  selector: 'app-questions-single',
  imports: [
    Sidenav,
    // DatePipe,
    UploadedAgoPipe,
    TopAnswer,
    Comments
],
  templateUrl: './questions-single.html',
  styleUrl: './questions-single.scss'
})
export class QuestionSingle {


  protected question!: IQuestionSingle; 
  private id: string | null = null;
  protected reputation: string | null = null;
  private userId: string | null = null;
  protected isLoading: boolean = true;
  protected isVoting: boolean = false;

  constructor(private route: ActivatedRoute, private questionService: QuestionsService, private userService: UserService) {
    this.route.paramMap.subscribe((params) => {
       this.id = params.get('id');
      

    });
  }

  ngOnInit(): void {

      this.isLoading = true;
      if (this.id) {
        console.log(this.id + ' OVO jE ID');
        this.questionService.getQuestionById(this.id).subscribe((question) => {
          this.question = question;
         

          this.userId = this.question.userId;
          this.userService.getReputation(this.userId).subscribe((rep) => {
            this.reputation = rep.reputation;
            
          });


          this.isLoading = false;


        });
      }
    
  }



  
  public toggleReplyForm(button: HTMLElement): void {
    console.log('da');
   
    let parent = button.closest('.action-buttons') || button.closest('.comment-actions');
    let container = parent?.closest('.answer-content') || parent?.closest('.comment-content');
    let replyForm = button.closest('.reply-form') as HTMLElement | null;

    
    if (button.classList.contains('cancel-reply')) {
      
      if (replyForm) {
        replyForm.style.display = 'none';
      }
      return;
    }
    
   
    if (container) {
      const foundForm = Array.from(container.querySelectorAll('.reply-form')).find(form =>
        (form as HTMLElement).closest('.answer-content') === container ||
        (form as HTMLElement).closest('.comment-content') === container
      );
      replyForm = foundForm ? (foundForm as HTMLElement) : null;
      
      if (replyForm) {
        replyForm.style.display = replyForm.style.display === 'none' ? 'block' : 'none';
      }
    }
  }


  public postComment(comment: string, parent: string): void {
   this.questionService.postComment(comment, this.question.id.toString(), parent).subscribe({
     next: (response) => {
       console.log(response);
     },
     error: (error) => {
       console.error(error);
     }
   });
  }

  // Voting methods for questions
  public upvoteQuestion(): void {
    if (this.isVoting || !this.id) return;
    
    this.isVoting = true;
    this.questionService.voteOnQuestion(this.id, 'upvote').subscribe({
      next: (response) => {
        console.log('Question upvote successful:', response);
        this.question.numberOfVotes = response.current_votes;
        this.isVoting = false;
      },
      error: (error) => {
        console.error('Error upvoting question:', error);
        this.isVoting = false;
      }
    });
  }

  public downvoteQuestion(): void {
    if (this.isVoting || !this.id) return;
    
    this.isVoting = true;
    this.questionService.voteOnQuestion(this.id, 'downvote').subscribe({
      next: (response) => {
        console.log('Question downvote successful:', response);
        this.question.numberOfVotes = response.current_votes;
        this.isVoting = false;
      },
      error: (error) => {
        console.error('Error downvoting question:', error);
        this.isVoting = false;
      }
    });
  }

}
