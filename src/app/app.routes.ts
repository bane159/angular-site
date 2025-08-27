import { Routes } from '@angular/router';
import { AuthGuard } from './users/guard/auth-guard';
import { Main } from './home/pages/main/main';
import { QuestionSingle } from './questions/pages/question-single/question-single';
import { TopUsersPage } from './users/components/top-users-page/top-users-page';
import { TagsPage } from './home/pages/tags-page/tags-page';

export const routes: Routes = [
  { 
    path: '', 
    // canActivate: [AuthGuard],
    loadComponent: () => import('./home/pages/main/main').then(m => m.Main)
  },
  { 
    path: 'login', 
    loadComponent: () => import('./users/components/login/login').then(m => m.LoginComponent)
  },
  { 
    path: 'register', 
    loadComponent: () => import('./users/components/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'questions/:tag',
    loadComponent: () => import('./home/pages/main/main').then(m => m.Main)
  },
  {
    path: 'question/:id',
    loadComponent: () => import('./questions/pages/question-single/question-single').then(m => m.QuestionSingle)
  },
  {
    path: 'users',
    loadComponent: () => import('./users/components/top-users-page/top-users-page').then(m => m.TopUsersPage)
  },
  {
    path: 'tags',
    loadComponent: () => import('./home/pages/tags-page/tags-page').then(m => m.TagsPage)
  },
  {
    path: 'ask-question',
    loadComponent: () => import('./questions/pages/ask-question/ask-question').then(m => m.AskQuestion),
    canActivate: [AuthGuard]
  },
  {
    path: 'my-questions',
    loadComponent: () => import('./questions/pages/list-user-questions/list-user-questions').then(m => m.ListUserQuestions),
    canActivate: [AuthGuard]
  },
  {
    path: 'questions/:id/edit',
    loadComponent: () => import('./questions/pages/edit-user-question/edit-user-question').then(m => m.EditUserQuestion),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./users/components/user-page/user-page').then(m => m.UserPage),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: ''
  },

];
