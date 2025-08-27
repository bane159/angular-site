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


}
