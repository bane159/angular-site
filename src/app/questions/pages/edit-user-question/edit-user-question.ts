import { Component, OnInit } from '@angular/core';
import { Layout } from "../../../shared/components/layout/layout";
import { SharedModule } from '../../../shared/shared-module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IQuestionCategory } from '../../interfaces/iquestion-category';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionsService } from '../../services/questions-service';
import { IQuestionSingle } from '../../interfaces/iquestion-single';
import { IQuestionForEdit } from '../../interfaces/iquestion-for-edit';

@Component({
  selector: 'app-edit-user-question',
  imports: [Layout, SharedModule],
  templateUrl: './edit-user-question.html',
  styleUrl: './edit-user-question.scss'
})
export class EditUserQuestion implements OnInit {
  questionForm: FormGroup;
  errorMessage: string | null = null;
  categories: IQuestionCategory[] = [];
  isSubmitting = false;
  isLoading = true;
  questionId: number | null = null;
  originalQuestion: IQuestionForEdit | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private questionService: QuestionsService
  ) {
    this.questionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      content: ['', [Validators.required, Validators.minLength(20)]],
      category: ['', [Validators.required]],
      tags: ['', [Validators.pattern(/^[a-zA-Z0-9\s,\-\.]+$/)]]
    });
    
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.questionId = +params['id'];
      if (this.questionId) {
        this.loadCategories();
        this.loadQuestion();
        
      }
    });
  }

  private loadCategories(): void {
    this.questionService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  private loadQuestion(): void {
    if (this.questionId) {
      this.questionService.getQuestionByIdForEdit(this.questionId.toString()).subscribe({
        next: (question) => {
          this.originalQuestion = question;
          this.populateForm(question);
          
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading question:', error);
          this.errorMessage = 'Failed to load question. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }

  private populateForm(question: IQuestionForEdit): void {
    

    
    const tagsString = question.tags ? question.tags.join(', ') : '';
    
    this.questionForm.patchValue({
      title: question.title,
      content: question.content,
      category: question.category,
      tags: tagsString
    });
  }



  onSubmit(): void {
    this.isSubmitting = true;
    if (this.questionForm.invalid) {
      this.markFormGroupTouched();
      this.isSubmitting = false;
      return;
    }

    if (!this.questionId) {
      this.errorMessage = 'Invalid question ID';
      this.isSubmitting = false;
      return;
    }

    const formData = this.questionForm.value;
    console.log('Updating question data:', formData);

    const tagsArray = formData.tags
      ? formData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0)
      : [];
    
    const questionData = {
      ...formData,
      tags: tagsArray
    };
    
    console.log('Processed question update data:', questionData);
    
    this.questionService.updateQuestion(this.questionId, questionData).subscribe({
      next: () => {
        console.log('Question updated successfully');
        this.router.navigate(['/question', this.questionId]);
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error updating question:', error);
        this.errorMessage = error.message || 'Failed to update question. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.questionForm.controls).forEach(key => {
      const control = this.questionForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.questionForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldDisplayName(fieldName)} must be at least ${requiredLength} characters`;
      }
      if (field.errors['pattern']) {
        return 'Tags can only contain letters, numbers, spaces, commas, hyphens, and periods';
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      title: 'Title',
      content: 'Content',
      category: 'Category',
      tags: 'Tags'
    };
    return displayNames[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.questionForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}
