import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SharedModule } from '../../../shared/shared-module';
import { Layout } from "../../../shared/components/layout/layout";
import { QuestionsService } from '../../services/questions-service';
import { AuthService } from '../../../users/services/auth';
import { IQuestionHome } from '../../interfaces/iquestion';
import { User } from '../../../users/interface/user';

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
  currentUser: User | null = null;
  userId: number | null = null;

  constructor(
    private questionsService: QuestionsService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.userId = this.currentUser.id;
      this.loadUserQuestions();
    }
  }

  loadUserQuestions(): void {
    this.isLoading = true;
    this.questionsService.getUserQuestions(this.userId).subscribe({ 
      next: (questions) => {
        this.questions = questions;
        
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      }
    });
  }

  canEditOrDelete(question: IQuestionHome): boolean {
    return this.authService.isLoggedIn() && 
           this.currentUser !== null;
  }

  editQuestion(questionId: number): void {
    this.router.navigate(['/questions', questionId, 'edit']);
  }

  deleteQuestion(questionId: number): void {
    this.isDeleting = true;
      this.questionsService.deleteQuestion(questionId).subscribe({
        next: () => {
          this.questions = this.questions.filter(q => q.id !== questionId);
          this.isDeleting = false;
        },
        error: (error) => {
          alert('Failed to delete question. Please try again.');
          this.isDeleting = false;
        }
      });
    
  }
}
