import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Layout } from "../../../shared/components/layout/layout";
import { SharedModule } from '../../../shared/shared-module';
import { UserService } from '../../services/user-service';
import { AuthService } from '../../services/auth';
import { User } from '../../interface/user';

@Component({
  selector: 'app-user-page',
  imports: [Layout, SharedModule, CommonModule, ReactiveFormsModule],
  templateUrl: './user-page.html',
  styleUrl: './user-page.scss'
})
export class UserPage implements OnInit {
  passwordForm: FormGroup;
  personalForm: FormGroup;
  accountForm: FormGroup;

  // Error and success messages
  passwordError: string | null = null;
  passwordSuccess: string | null = null;
  personalError: string | null = null;
  personalSuccess: string | null = null;
  accountError: string | null = null;
  accountSuccess: string | null = null;

  // Loading states
  isSubmittingPassword = false;
  isSubmittingPersonal = false;
  isSubmittingAccount = false;

  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.personalForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]]
    });

    this.accountForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.loadUserData();
    }
  }

  private loadUserData(): void {
    // Populate forms with current user data
    if (this.currentUser) {
      this.personalForm.patchValue({
        firstName: this.currentUser.name || '',
        lastName: this.currentUser.lastname || ''
      });

      this.accountForm.patchValue({
        username: this.currentUser.username || '',
        email: this.currentUser.email || ''
      });
    }
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.markFormGroupTouched(this.passwordForm);
      return;
    }

    this.isSubmittingPassword = true;
    this.passwordError = null;
    this.passwordSuccess = null;

    const { oldPassword, newPassword } = this.passwordForm.value;

    this.userService.changePassword(oldPassword, newPassword).subscribe({
      next: () => {
        this.passwordSuccess = 'Password updated successfully!';
        this.passwordForm.reset();
        this.isSubmittingPassword = false;
      },
      error: (error) => {
        this.passwordError = error.error?.message || 'Failed to update password. Please try again.';
        this.isSubmittingPassword = false;
      }
    });
  }

  updatePersonalInfo(): void {
    if (this.personalForm.invalid) {
      this.markFormGroupTouched(this.personalForm);
      return;
    }

    this.isSubmittingPersonal = true;
    this.personalError = null;
    this.personalSuccess = null;

    const { firstName, lastName } = this.personalForm.value;

    this.userService.updatePersonalInfo(firstName, lastName).subscribe({
      next: (response) => {
        this.personalSuccess = response.message || 'Personal information updated successfully!';
        this.isSubmittingPersonal = false;
        // Update current user data using AuthService
        this.authService.updateCurrentUser(response.user);
        this.currentUser = response.user;
      },
      error: (error) => {
        this.personalError = error.error?.message || 'Failed to update personal information. Please try again.';
        this.isSubmittingPersonal = false;
      }
    });
  }

  updateAccountInfo(): void {
    if (this.accountForm.invalid) {
      this.markFormGroupTouched(this.accountForm);
      return;
    }

    this.isSubmittingAccount = true;
    this.accountError = null;
    this.accountSuccess = null;

    const { username, email } = this.accountForm.value;

    this.userService.updateAccountInfo(username, email).subscribe({
      next: (response) => {
        this.accountSuccess = response.message || 'Account information updated successfully!';
        this.isSubmittingAccount = false;
        // Update current user data using AuthService
        this.authService.updateCurrentUser(response.user);
        this.currentUser = response.user;
      },
      error: (error) => {
        this.accountError = error.error?.message || 'Failed to update account information. Please try again.';
        this.isSubmittingAccount = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string, formType: string): string {
    let form: FormGroup;
    switch (formType) {
      case 'password':
        form = this.passwordForm;
        break;
      case 'personal':
        form = this.personalForm;
        break;
      case 'account':
        form = this.accountForm;
        break;
      default:
        return '';
    }

    const field = form.get(fieldName);
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
      oldPassword: 'Current Password',
      newPassword: 'New Password',
      firstName: 'First Name',
      lastName: 'Last Name',
      username: 'Username',
      email: 'Email'
    };
    return displayNames[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string, formType: string): boolean {
    let form: FormGroup;
    switch (formType) {
      case 'password':
        form = this.passwordForm;
        break;
      case 'personal':
        form = this.personalForm;
        break;
      case 'account':
        form = this.accountForm;
        break;
      default:
        return false;
    }

    const field = form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}
