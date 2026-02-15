import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TopComment, Answer, Comment } from '../interfaces/comment';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: HttpClient) { }

  public getTopAnswer(questionId: string) : Observable<TopComment> {
    return this.http.get<TopComment>(`${environment.apiUrl}/questions/${questionId}/top-answer`);
  }

  public getAllAnswers(questionId: string): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${environment.apiUrl}/questions/${questionId}/answers`);
  }
  
  public getGeneralComments(questionId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${environment.apiUrl}/questions/${questionId}/comments`);
  }
}
