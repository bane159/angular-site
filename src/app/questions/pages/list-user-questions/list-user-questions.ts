import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SharedModule } from '../../../shared/shared-module';
import { Layout } from "../../../shared/components/layout/layout";
import { QuestionsService } from '../../services/questions-service';
import { AuthService } from '../../../users/services/auth';
import { IQuestionHome } from '../../interfaces/iquestion';

@Component({
  selector: 'app-list-user-questions',
  imports: [SharedModule, Layout, DatePipe],
  standalone: true,
  templateUrl: './list-user-questions.html',
  styleUrl: './list-user-questions.scss'
})
export class ListUserQuestions implements OnInit {
  questions: IQuestionHome[] = [];
  isLoading = false;
  isDeleting = false;
  currentUser: any = null;
  userId: number | null = null;

  constructor(
    private questionsService: QuestionsService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    console.log(this.currentUser.id);
    this.userId = this.authService.getCurrentUser().id;

    this.loadUserQuestions();
  }

  loadUserQuestions(): void {
    this.isLoading = true;
    this.questionsService.getUserQuestions(this.userId).subscribe({ 
      next: (questions) => {
        this.questions = questions;
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user questions:', error);
        this.isLoading = false;
      }
    });
  }

  canEditOrDelete(question: IQuestionHome): boolean {
    return this.authService.isLoggedIn() && 
           this.currentUser ;
  }

  editQuestion(questionId: number): void {
    this.router.navigate(['/questions', questionId, 'edit']);
  }

  deleteQuestion(questionId: number): void {
    console.log('Deleting question with ID:', questionId);
    this.isDeleting = true;
      this.questionsService.deleteQuestion(questionId).subscribe({
        next: () => {
          console.log('Question deleted successfully');
          this.questions = this.questions.filter(q => q.id !== questionId);
          console.log('Question deleted successfully');
          this.isDeleting = false;
        },
        error: (error) => {
          console.error('Error deleting question:', error);
          alert('Failed to delete question. Please try again.');
          this.isDeleting = false;
        }
      });
    
  }
}
