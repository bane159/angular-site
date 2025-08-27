import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../users/services/auth';
import { CommonModule } from '@angular/common';
import { Layout } from "../../../shared/components/layout/layout";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Layout],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({ // napravi novi form group objekat - pogledaj docs ako zaboravis
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formData = this.registerForm.value;
    console.log('Registration data:', formData);
    



      this.authService.register(formData.name, formData.lastname, formData.username, formData.email, formData.password).subscribe({
        next: () => {
          console.log('Registration successful');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.errorMessage = 'Registration failed. Please try again. ' + error.message;
        }
      });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldDisplayName(fieldName)} must be at least ${requiredLength} characters`;
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      name: 'Name',
      lastname: 'Last Name',
      username: 'Username',
      email: 'Email',
      password: 'Password'
    };
    return displayNames[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}
