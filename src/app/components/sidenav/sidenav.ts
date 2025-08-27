import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../users/services/auth';
import { SharedModule } from '../../shared/shared-module';
import { User } from '../../users/interface/user';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss'
})
export class Sidenav implements OnInit {
  isLoggedIn = false;
  currentUser: User | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$().subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        this.currentUser = this.authService.getCurrentUser();
      } else {
        this.currentUser = null;
      }
    });
  }

  public isActive(route: string): string {
    return this.router.url === route ? 'active' : '';
  }

  logout(): void {
    this.authService.logout();
  }
}
