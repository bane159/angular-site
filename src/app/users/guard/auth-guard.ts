import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.isLoggedIn$().pipe(
      map(isLoggedIn => {
        if (isLoggedIn) {
          return true;
        }
        return this.router.createUrlTree(['/login']);
      })
    );
  }
}
