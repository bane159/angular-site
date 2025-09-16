import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TopComment, Answer, Comment } from '../interfaces/comment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: HttpClient) { }

  public getTopAnswer(questionId: string) : Observable<TopComment> {
    return this.http.get<TopComment>(`http://localhost:8000/api/questions/${questionId}/top-answer`);
  }

  public getAllAnswers(questionId: string): Observable<Answer[]> {
    return this.http.get<Answer[]>(`http://localhost:8000/api/questions/${questionId}/answers`);
  }
  
  public getGeneralComments(questionId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`http://localhost:8000/api/questions/${questionId}/comments`);
  }
}
