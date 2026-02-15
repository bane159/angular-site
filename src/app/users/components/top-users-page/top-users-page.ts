import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user-service';
import { TopUser } from '../../interface/top-user';
import { Layout } from '../../../shared/components/layout/layout';

@Component({
  selector: 'app-top-users-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    Layout
  ],
  templateUrl: './top-users-page.html',
  styleUrl: './top-users-page.scss'
})
export class TopUsersPage implements OnInit {
  topUsers: TopUser[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  
  constructor(private userService: UserService) {}
  
  ngOnInit(): void {
    this.loadTopUsers();
  }
  
  loadTopUsers(): void {
    this.isLoading = true;
    this.userService.getTopUsers().subscribe({
      next: (users) => {
        this.topUsers = users;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load top users. Please try again later.';
        this.isLoading = false;
      }
    });
  }
}
