import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared-module';
import { Layout } from '../../../shared/components/layout/layout';
import { IQuestionCategory } from '../../interfaces/iquestion-category';
import { QuestionsService } from '../../services/questions-service';

@Component({
  selector: 'app-ask-question',
  imports: [ReactiveFormsModule, SharedModule, Layout],
  standalone: true,
  templateUrl: './ask-question.html',
  styleUrl: './ask-question.scss'
})
export class AskQuestion implements OnInit{
  questionForm: FormGroup;
  errorMessage: string | null = null;
  categories: IQuestionCategory[] = [];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private questionService: QuestionsService
  ) {
    this.questionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      content: ['', [Validators.required, Validators.minLength(20)]],
      category: ['', [Validators.required]],
      tags: ['', [Validators.pattern(/^[a-zA-Z0-9\s,\-\.]+$/)]]
    });
  }


  ngOnInit(){
    this.loadCategories();
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



  onSubmit(): void {
    this.isSubmitting = true;
    if (this.questionForm.invalid) {
      this.markFormGroupTouched();
      this.isSubmitting = false;
      return;
    }

    const formData = this.questionForm.value;
    console.log('Question data:', formData);

    const tagsArray = formData.tags
      ? formData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0)
      : [];
    
    const questionData = {
      ...formData,
      tags: tagsArray
    };
    
    console.log('Processed question data:', questionData);
    
    // TODO: Add actual question submission logic here
    this.questionService.createQuestion(questionData).subscribe({
      next: () => {
        this.router.navigate(['/']);
        this.isSubmitting = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to post question. Please try again.';
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
